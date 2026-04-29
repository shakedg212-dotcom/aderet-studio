-- Extensions
create extension if not exists "pgcrypto";

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_he text not null,
  price_ils numeric(10,2) not null check (price_ils >= 0),
  image_url text,
  is_active boolean not null default true
);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  customer_name text not null,
  phone text not null,
  street text not null,
  house_number text not null,
  city text not null,
  zip_code text,
  delivery_instructions text,
  notes text,
  product_price_ils numeric(10,2) not null check (product_price_ils >= 0),
  shipping_ils numeric(10,2) not null check (shipping_ils >= 0),
  total_ils numeric(10,2) not null check (total_ils >= 0),
  payment_status text not null check (
    payment_status in ('ממתין לתשלום', 'שולם', 'נכשל', 'בוטל')
  ),
  order_status text not null check (
    order_status in ('חדש', 'בטיפול', 'בייצור', 'נשלח', 'הושלם')
  ),
  stripe_checkout_session_id text unique,
  created_at timestamp with time zone not null default now()
);

-- SHIPMENTS (optional for phase 1, included for phase 2)
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  shipping_status text not null default 'חדש',
  tracking_number text,
  tracking_url text,
  updated_at timestamp with time zone not null default now()
);

-- Helpful indexes
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_order_status on public.orders(order_status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.shipments enable row level security;

-- Allow storefront to read active products with publishable key
drop policy if exists "read_active_products" on public.products;
create policy "read_active_products"
on public.products
for select
to anon
using (is_active = true);

-- Do not allow anon access to orders/shipments by default.
-- Server-side API uses SUPABASE_SERVICE_ROLE_KEY.

-- Seed examples in Hebrew
insert into public.products (name_he, price_ils, image_url, is_active)
values
  ('דגם נחל נובע', 1200, '/images/collection-1.png', true),
  ('דגם אפור אורבני', 950, '/images/collection-2.png', true),
  ('דגם חום מלכותי', 750, '/images/collection-6.png', true)
on conflict do nothing;
