/*
# Add warranty column to products

1. Why
- The storefront product page now has a dedicated "Warranty" tab; previously
  warranty text only existed baked into a few products' free-form
  `specifications` rows, with no queryable column of its own.

2. New Columns
- `products.warranty` — free text, e.g. "1-Year Manufacturer Warranty" or
  "3 Years On-Site Comprehensive Warranty".
*/

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS warranty text;
