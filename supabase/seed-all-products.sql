-- Run this in Supabase SQL Editor to sync all products from website cards.

create unique index if not exists idx_products_name_he_unique on public.products(name_he);

insert into public.products (name_he, price_ils, image_url, is_active)
values
  ('דגם נחל נובע', 1200, '/images/collection-1.png', true),
  ('דגם אפור אורבני', 950, '/images/collection-2.png', true),
  ('דגם מזמור לתודה', 1100, '/images/collection-3.png', true),
  ('דגם האישי שלי', 850, '/images/collection-4.png', true),
  ('דגם חתן ספיר', 1500, '/images/collection-5.png', true),
  ('דגם חום מלכותי', 750, '/images/collection-6.png', true)
on conflict (name_he) do update
set
  price_ils = excluded.price_ils,
  image_url = excluded.image_url,
  is_active = excluded.is_active;

select id, name_he, price_ils, is_active
from public.products
order by name_he;
