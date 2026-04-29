import { getSupabaseAdmin } from "../../../utils/supabase/admin";
import { calculateShippingIls, ORDER_PAYMENT_STATUS, ORDER_STATUS } from "../../../lib/payments";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function badRequest(message) {
  return Response.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(request) {
  try {
    const {
      productId,
      firstName,
      lastName,
      phone,
      street,
      houseNumber,
      floor,
      city,
      zipCode,
      deliveryInstructions,
      notes,
    } = await request.json();

    if (!productId || !firstName || !lastName || !phone || !street || !houseNumber || !city) {
      return badRequest("Missing required fields.");
    }

    let supabaseAdmin = null;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch (_) {
      // Fallback for local/dev when service role key is not configured.
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        return Response.json(
          {
            ok: false,
            error: "חסרים משתני Supabase. יש להגדיר לפחות NEXT_PUBLIC_SUPABASE_URL ו-NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
          },
          { status: 500 }
        );
      }
      supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, price_ils, is_active")
      .eq("id", productId)
      .single();

    if (productError || !product || !product.is_active) {
      return badRequest("Product not found or inactive.");
    }

    const productPriceIls = Number(product.price_ils);
    const shippingIls = calculateShippingIls(productPriceIls);
    const totalIls = productPriceIls + shippingIls;

    const cleanFloor = floor?.trim();
    const mergedDeliveryInstructions = [cleanFloor ? `קומה: ${cleanFloor}` : null, deliveryInstructions?.trim() || null]
      .filter(Boolean)
      .join(" | ");

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        product_id: product.id,
        customer_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        phone: phone.trim(),
        street: street.trim(),
        house_number: houseNumber.trim(),
        city: city.trim(),
        zip_code: zipCode?.trim() || null,
        delivery_instructions: mergedDeliveryInstructions || null,
        notes: notes?.trim() || null,
        product_price_ils: productPriceIls,
        shipping_ils: shippingIls,
        total_ils: totalIls,
        payment_status: ORDER_PAYMENT_STATUS.PENDING,
        order_status: ORDER_STATUS.NEW,
      })
      .select("id, total_ils, payment_status, order_status")
      .single();

    if (orderError || !order) {
      const rawError = orderError?.message || "Could not create order.";
      const friendlyError = rawError.includes("row-level security")
        ? "אין הרשאת כתיבה לטבלת orders. יש להוסיף SUPABASE_SERVICE_ROLE_KEY בשרת או policy insert מתאים ב-Supabase."
        : rawError;
      return Response.json(
        {
          ok: false,
          error: friendlyError,
        },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, order });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
