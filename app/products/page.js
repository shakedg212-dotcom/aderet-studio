import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name_he, price_ils, image_url, is_active")
    .eq("is_active", true)
    .order("name_he", { ascending: true });

  return (
    <main style={{ padding: "40px 24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "10px" }}>מוצרים מהדאטהבייס</h1>
      <p style={{ marginBottom: "22px", color: "#555" }}>
        עמוד בדיקה ל-Supabase על SSR (שרת).
      </p>

      {error ? (
        <p style={{ color: "#a10000" }}>שגיאה בטעינת מוצרים: {error.message}</p>
      ) : !products?.length ? (
        <p>לא נמצאו מוצרים פעילים בטבלה `products`.</p>
      ) : (
        <ul style={{ display: "grid", gap: "12px", listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "14px",
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 700 }}>{product.name_he}</div>
              <div style={{ marginTop: "6px" }}>מחיר: ₪{Number(product.price_ils)}</div>
              <div style={{ marginTop: "6px", color: "#666", fontSize: "14px" }}>
                תמונה: {product.image_url || "לא הוגדרה"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
