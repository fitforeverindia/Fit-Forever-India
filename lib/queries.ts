import { supabase } from './supabase';
import { SEED_PRODUCTS, SEED_CATEGORIES } from './data';
import type { Product, Category } from './types';

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  rating: number;
  review_count: number;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  category_id: string | null;
  product_categories?: { id: string; name: string; slug: string }[] | null;
};

function mapRow(row: ProductRow): Product {
  const cat = Array.isArray(row.product_categories) ? row.product_categories[0] : null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categorySlug: cat?.slug ?? '',
    categoryName: cat?.name ?? '',
    shortDescription: row.short_description,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    image: row.image_url ?? '',
    gallery: row.gallery_urls ?? [],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    badge: row.badge,
    featured: row.is_featured,
    inStock: row.is_active,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('id, name, slug, description, image_url, sort_order')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    return SEED_CATEGORIES;
  }

  return data.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image_url ?? '',
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('id, name, slug, description, image_url')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    const seed = SEED_CATEGORIES.find((c) => c.slug === slug);
    return seed ?? null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    image: data.image_url ?? '',
  };
}

export async function getProducts(opts: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(
      'id, name, slug, short_description, description, price, compare_at_price, image_url, gallery_urls, rating, review_count, badge, is_featured, is_active, category_id, product_categories(id, name, slug)'
    )
    .eq('is_active', true);

  if (opts.featured) query = query.eq('is_featured', true);
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    let fallback = [...SEED_PRODUCTS];
    if (opts.featured) fallback = fallback.filter((p) => p.featured);
    if (opts.categorySlug) fallback = fallback.filter((p) => p.categorySlug === opts.categorySlug);
    if (opts.search) {
      const q = opts.search.toLowerCase();
      fallback = fallback.filter((p) => p.name.toLowerCase().includes(q));
    }
    return applySort(fallback, opts.sort).slice(0, opts.limit ?? fallback.length);
  }

  let products = data.map(mapRow);
  if (opts.categorySlug) products = products.filter((p) => p.categorySlug === opts.categorySlug);
  if (opts.search) {
    const q = opts.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription ?? '').toLowerCase().includes(q)
    );
  }
  return applySort(products, opts.sort);
}

function applySort(products: Product[], sort?: string): Product[] {
  const arr = [...products];
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating);
    default:
      return arr.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, slug, short_description, description, price, compare_at_price, image_url, gallery_urls, rating, review_count, badge, is_featured, is_active, category_id, product_categories(id, name, slug)'
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  return mapRow(data);
}
