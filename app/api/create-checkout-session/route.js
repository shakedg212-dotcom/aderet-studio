import Stripe from "stripe";
import { getSupabaseAdmin } from "../../../utils/supabase/admin";
import {
  calculateShippingIls,
  ORDER_PAYMENT_STATUS,
  ORDER_STATUS,
  toAgorot,
} from "../../../lib/payments";

export const runtime = "nodejs";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.SITE_URL;

    if (!stripeSecretKey || !siteUrl) {
      return Response.json(
        { error: "Missing STRIPE_SECRET_KEY or SITE_URL environment variables." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const supabaseAdmin = getSupabaseAdmin();

    const body = await request.json();
    const {
      productId,
      customerName,
      phone,
      street,
      houseNumber,
      city,
      zipCode,
      deliveryInstructions,
      notes,
    } = body || {};

    if (!productId || !customerName || !phone || !street || !houseNumber || !city) {
      return badRequest("Missing required fields.");
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, name_he, price_ils, image_url, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product || !product.is_active) {
      return badRequest("Product not found or inactive.");
    }

    const productPriceIls = Number(product.price_ils);
    const shippingIls = calculateShippingIls(productPriceIls);
    const totalIls = productPriceIls + shippingIls;

    const { data: createdOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        product_id: product.id,
        customer_name: customerName,
        phone,
        street,
        house_number: houseNumber,
        city,
        zip_code: zipCode || null,
        delivery_instructions: deliveryInstructions || null,
        notes: notes || null,
        product_price_ils: productPriceIls,
        shipping_ils: shippingIls,
        total_ils: totalIls,
        payment_status: ORDER_PAYMENT_STATUS.PENDING,
        order_status: ORDER_STATUS.NEW,
      })
      .select("id")
      .single();

    if (orderError || !createdOrder) {
      return Response.json(
        { error: "Could not create order record.", details: orderError?.message },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "ils",
      customer_creation: "always",
      locale: "he",
      success_url: `${siteUrl}/?payment=success&order=${createdOrder.id}`,
      cancel_url: `${siteUrl}/?payment=cancelled&order=${createdOrder.id}`,
      metadata: {
        order_id: createdOrder.id,
        product_id: product.id,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "ils",
            unit_amount: toAgorot(productPriceIls),
            product_data: {
              name: product.name_he,
              images: product.image_url ? [product.image_url] : [],
            },
          },
        },
        ...(shippingIls > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "ils",
                  unit_amount: toAgorot(shippingIls),
                  product_data: { name: "משלוח" },
                },
              },
            ]
          : []),
      ],
      phone_number_collection: { enabled: true },
    });

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", createdOrder.id);

    if (updateError) {
      return Response.json(
        { error: "Order created but could not save Stripe session.", details: updateError.message },
        { status: 500 }
      );
    }

    return Response.json({
      checkoutUrl: session.url,
      orderId: createdOrder.id,
    });
  } catch (error) {
    return Response.json({ error: error.message || "Unexpected error." }, { status: 500 });
  }
}
