/*
# Add technical spec, feature, and merchandising columns to products

1. Why
- The admin "Technical Specs", "Features & Certs", and "Colors & Media" tabs already
  collect this data in the UI, but the live `products` table never had matching
  columns, so it was silently dropped on save.

2. New Columns
- Category redundancy: category_slug, category_name (fallback if category_id join fails)
- Electrical specs: rated_voltage, rated_frequency, rated_power, safety_class,
  rated_time, noise_level, air_pressure
- Weight & dimensions: net_weight, gross_weight, dimensions_sit_up,
  dimensions_lay_down, package_size
- Logistics: container_qty
- Feature attributes: massage_techniques, auto_programs_count, rail_type,
  ai_body_detection, heating, airbag_zones, voice_control, bluetooth_speaker,
  remote_type, charging
- Merchandising: certifications (text[]), color_variants (jsonb), sizes (text[]),
  colors (text[]), specifications (jsonb)

3. Notes
- All columns are nullable text/array/jsonb with safe defaults so existing rows
  are unaffected.
*/

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category_slug text,
  ADD COLUMN IF NOT EXISTS category_name text,

  ADD COLUMN IF NOT EXISTS rated_voltage text,
  ADD COLUMN IF NOT EXISTS rated_frequency text,
  ADD COLUMN IF NOT EXISTS rated_power text,
  ADD COLUMN IF NOT EXISTS safety_class text,
  ADD COLUMN IF NOT EXISTS rated_time text,
  ADD COLUMN IF NOT EXISTS noise_level text,
  ADD COLUMN IF NOT EXISTS air_pressure text,

  ADD COLUMN IF NOT EXISTS net_weight text,
  ADD COLUMN IF NOT EXISTS gross_weight text,
  ADD COLUMN IF NOT EXISTS dimensions_sit_up text,
  ADD COLUMN IF NOT EXISTS dimensions_lay_down text,
  ADD COLUMN IF NOT EXISTS package_size text,

  ADD COLUMN IF NOT EXISTS container_qty text,

  ADD COLUMN IF NOT EXISTS massage_techniques text,
  ADD COLUMN IF NOT EXISTS auto_programs_count text,
  ADD COLUMN IF NOT EXISTS rail_type text,
  ADD COLUMN IF NOT EXISTS ai_body_detection text,
  ADD COLUMN IF NOT EXISTS heating text,
  ADD COLUMN IF NOT EXISTS airbag_zones text,
  ADD COLUMN IF NOT EXISTS voice_control text,
  ADD COLUMN IF NOT EXISTS bluetooth_speaker text,
  ADD COLUMN IF NOT EXISTS remote_type text,
  ADD COLUMN IF NOT EXISTS charging text,

  ADD COLUMN IF NOT EXISTS certifications text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS color_variants jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS sizes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS colors text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specifications jsonb NOT NULL DEFAULT '[]';
