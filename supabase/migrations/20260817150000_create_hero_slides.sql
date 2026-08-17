/*
# Create hero_slides table

1. Why
- The homepage hero banner (components/sections/hero-slider.tsx) was hardcoded
  in the frontend. The admin wants to manage hero slides (banner images,
  headline text, buttons) from the admin dashboard instead of editing code.

2. New Tables
- `hero_slides` stores each rotating hero banner slide: a 16:9 desktop/laptop
  image, a 4:5 mobile image, eyebrow/title/subtitle copy, and two CTA buttons.

3. Security
- Row level security enabled, matching the open read/write pattern already
  used by `products` and `product_categories` in this project.
*/

CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text,
  title text NOT NULL,
  subtitle text,
  image_desktop text,
  image_mobile text,
  primary_label text,
  primary_href text,
  secondary_label text,
  secondary_href text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read hero slides" ON public.hero_slides;
CREATE POLICY "Public can read hero slides" ON public.hero_slides FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can insert hero slides" ON public.hero_slides;
CREATE POLICY "Public can insert hero slides" ON public.hero_slides FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public can update hero slides" ON public.hero_slides;
CREATE POLICY "Public can update hero slides" ON public.hero_slides FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public can delete hero slides" ON public.hero_slides;
CREATE POLICY "Public can delete hero slides" ON public.hero_slides FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS hero_slides_sort_order_idx ON public.hero_slides(sort_order);
