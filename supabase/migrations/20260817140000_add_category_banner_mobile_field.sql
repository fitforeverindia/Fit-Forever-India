/*
# Add banner_url_mobile column to product_categories

1. Why
- The category page banner (/products?category=slug) currently only has one
  `banner_url` image, used for all screen sizes. We now want a dedicated
  mobile-optimized banner image, matching the hero slider's desktop/mobile
  image pattern.

2. New Columns
- `product_categories.banner_url_mobile` — mobile-optimized banner image
  shown on the category page when viewed on small screens. Falls back to
  `banner_url` when empty.
*/

ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS banner_url_mobile text;
