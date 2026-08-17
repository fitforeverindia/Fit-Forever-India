/*
# Add banner_url column to product_categories

1. Why
- Each category listing page (/products?category=slug) now shows a
  full-width banner specific to that category, separate from the small
  square thumbnail used in the homepage category grid.

2. New Columns
- `product_categories.banner_url` — wide banner image shown at the top of
  the products page when that category is selected.
*/

ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS banner_url text;
