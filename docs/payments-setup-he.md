## הגדרות סביבה ב-Vercel

יש להגדיר ב-Project Settings -> Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SITE_URL` (לדוגמה `https://aderet.co.il`)

## הגדרת בסיס נתונים

1. פתח Supabase -> SQL Editor
2. הרץ את הקובץ `supabase/schema.sql`
3. ודא שנוצרו הטבלאות:
   - `products`
   - `orders`
   - `shipments`

## בדיקות API מהירות

### יצירת Checkout

Endpoint:
- `POST /api/create-checkout-session`

Body לדוגמה:

```json
{
  "productId": "REPLACE_WITH_PRODUCT_UUID",
  "customerName": "ישראל ישראלי",
  "phone": "0500000000",
  "street": "הרצל",
  "houseNumber": "10",
  "city": "תל אביב",
  "zipCode": "61000",
  "deliveryInstructions": "להשאיר ליד הדלת",
  "notes": "לתאם טלפונית לפני הגעה"
}
```

### Stripe Webhook

Endpoint:
- `POST /api/stripe-webhook`

אירועים נתמכים:
- `checkout.session.completed` -> `payment_status = שולם`
- `checkout.session.async_payment_failed` -> `payment_status = נכשל`
- `checkout.session.expired` -> `payment_status = בוטל`
