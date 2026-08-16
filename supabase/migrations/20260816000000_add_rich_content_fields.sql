/*
# Add description_html, faqs, and video_url columns to products

1. Why
- The product detail page now needs to show the full rich HTML description
  (with embedded images) exactly as it appears on the source website.
- FAQs are displayed as an accordion on the product detail page.
- Some products have a video tab with a YouTube or similar embed.

2. New Columns
- `description_html` — full HTML content of the Description tab (with absolute image URLs)
- `specification_html` — full HTML content of the Specification tab
- `warranty_html` — full HTML content of the Warranty tab
- `faqs` — JSONB array of {question, answer} objects
- `video_url` — URL of the product video (YouTube embed, etc.)
*/

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS description_html text,
  ADD COLUMN IF NOT EXISTS specification_html text,
  ADD COLUMN IF NOT EXISTS warranty_html text,
  ADD COLUMN IF NOT EXISTS faqs jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS video_url text;
