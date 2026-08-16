-- 1. Modify the customers table to add preferences if they do not exist
ALTER TABLE public.customers 
  ADD COLUMN IF NOT EXISTS order_updates boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS promo_notifications boolean NOT NULL DEFAULT false;

-- 2. Create customer_addresses table
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  address_type text NOT NULL DEFAULT 'Home', -- 'Home', 'Work', 'Other'
  full_name text NOT NULL,
  phone_number text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pin_code text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY, -- Custom format: e.g. FF-ORD-9842
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Processing', -- 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  shipping numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  shipping_name text NOT NULL,
  shipping_phone text NOT NULL,
  shipping_address_line1 text NOT NULL,
  shipping_address_line2 text,
  shipping_city text NOT NULL,
  shipping_state text NOT NULL,
  shipping_pin_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 6. Add RLS Policies
-- Allow anyone to select/insert/update/delete for prototype simplicity (following existing project policies pattern)
DROP POLICY IF EXISTS "Public can read customer_addresses" ON public.customer_addresses;
CREATE POLICY "Public can read customer_addresses" ON public.customer_addresses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can insert customer_addresses" ON public.customer_addresses;
CREATE POLICY "Public can insert customer_addresses" ON public.customer_addresses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update customer_addresses" ON public.customer_addresses;
CREATE POLICY "Public can update customer_addresses" ON public.customer_addresses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can delete customer_addresses" ON public.customer_addresses;
CREATE POLICY "Public can delete customer_addresses" ON public.customer_addresses FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read orders" ON public.orders;
CREATE POLICY "Public can read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can delete orders" ON public.orders;
CREATE POLICY "Public can delete orders" ON public.orders FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read order_items" ON public.order_items;
CREATE POLICY "Public can read order_items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can insert order_items" ON public.order_items;
CREATE POLICY "Public can insert order_items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update order_items" ON public.order_items;
CREATE POLICY "Public can update order_items" ON public.order_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can delete order_items" ON public.order_items;
CREATE POLICY "Public can delete order_items" ON public.order_items FOR DELETE TO anon, authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS customer_addresses_customer_id_idx ON public.customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);
