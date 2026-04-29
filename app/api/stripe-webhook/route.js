import Stripe from "stripe";
import { getSupabaseAdmin } from "../../../utils/supabase/admin";
import { ORDER_PAYMENT_STATUS } from "../../../lib/payments";

export const runtime = "nodejs";

async function updateOrderPaymentStatus(supabaseAdmin, sessionId, paymentStatus) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("stripe_checkout_session_id", sessionId);

  return error;
}

export async function POST(request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return Response.json(
      { error: "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET environment variables." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const supabaseAdmin = getSupabaseAdmin();
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
  } catch (error) {
    return Response.json({ error: `Webhook signature error: ${error.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await updateOrderPaymentStatus(supabaseAdmin, session.id, ORDER_PAYMENT_STATUS.PAID);
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;
      await updateOrderPaymentStatus(supabaseAdmin, session.id, ORDER_PAYMENT_STATUS.FAILED);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      await updateOrderPaymentStatus(supabaseAdmin, session.id, ORDER_PAYMENT_STATUS.CANCELED);
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message || "Webhook handling failed." }, { status: 500 });
  }
}
