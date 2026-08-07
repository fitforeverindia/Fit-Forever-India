/*
# Create Fit Forever public catalog

1. New Tables
- `product_categories` stores the reusable catalog categories shown across the storefront.
- `products` stores product names, descriptions, pricing, imagery, ratings, badges, and inventory visibility.

2. Important Columns
- `product_categories.slug` is the stable public category identifier.
- `products.category_id` links each product to one category.
- `products.price` and `products.compare_at_price` support sale pricing.
- `products.is_featured` controls homepage merchandising.

3. Security
- Row level security is enabled on both tables.
- The storefront is intentionally public and uses separate CRUD policies for anonymous and authenticated visitors.

4. Notes
- No user accounts or user-owned data are introduced.
- The tables are designed to support a future admin dashboard without changing the public catalog shape.
*/

CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.product_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(12,2),
  image_url text,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  review_count integer NOT NULL DEFAULT 0,
  badge text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read product categories" ON public.product_categories;
CREATE POLICY "Public can read product categories" ON public.product_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can insert product categories" ON public.product_categories;
CREATE POLICY "Public can insert product categories" ON public.product_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update product categories" ON public.product_categories;
CREATE POLICY "Public can update product categories" ON public.product_categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can delete product categories" ON public.product_categories;
CREATE POLICY "Public can delete product categories" ON public.product_categories FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can read products" ON public.products;
CREATE POLICY "Public can read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can insert products" ON public.products;
CREATE POLICY "Public can insert products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update products" ON public.products;
CREATE POLICY "Public can update products" ON public.products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can delete products" ON public.products;
CREATE POLICY "Public can delete products" ON public.products FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(is_featured) WHERE is_active = true;
