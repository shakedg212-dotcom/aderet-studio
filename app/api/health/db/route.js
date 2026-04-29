import { createClient } from "../../../../utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (error) {
      return Response.json(
        {
          ok: false,
          message: "Database query failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      message: "Database connection is healthy",
      activeProductsCount: count ?? 0,
    });
  } catch (error) {
    return Response.json(
      { ok: false, message: "Unexpected server error", error: error.message },
      { status: 500 }
    );
  }
}
