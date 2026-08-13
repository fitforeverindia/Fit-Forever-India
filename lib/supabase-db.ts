import { createClient } from '@supabase/supabase-js';
import type { Category, Product, Customer } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezudcnndhboepasvlvas.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dWRjbm5kaGJvZXBhc3ZsdmFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTkxODQ1NiwiZXhwIjoyMTAxNDk0NDU2fQ.PWTTc_79-5GjInTSy4BJpBBvCQuc-abAnftJDeh8LU4';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function isValidUUID(id?: string): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

// === PRODUCT MAPPERS ===
function mapProductToRow(p: Product) {
  const row: any = {
    name: p.name,
    model: p.model || null,
    slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() : 'product-' + Date.now()),
    category_slug: p.categorySlug || null,
    category_name: p.categoryName || null,
    short_description: p.shortDescription || null,
    description: p.description || null,
    price: p.price || 0,
    compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    image_url: p.image || null,
    gallery_urls: p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
    rating: p.rating || 5.0,
    review_count: p.reviewCount || 0,
    badge: p.badge || null,
    is_featured: p.featured ?? true,
    is_active: p.inStock ?? true,
  };

  if (isValidUUID(p.id)) {
    row.id = p.id;
  }

  return row;
}

function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    model: row.model || undefined,
    slug: row.slug,
    categorySlug: row.category_slug || 'massage-chairs',
    categoryName: row.category_name || 'Massage Chairs',
    shortDescription: row.short_description || null,
    description: row.description || null,
    price: Number(row.price || 0),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    image: row.image_url || 'https://images.pexels.com/photos/4198567/pexels-photo-4198567.jpeg',
    gallery: Array.isArray(row.gallery_urls) ? row.gallery_urls : [],
    rating: Number(row.rating || 5),
    reviewCount: Number(row.review_count || 0),
    badge: row.badge || null,
    featured: Boolean(row.is_featured),
    inStock: Boolean(row.is_active),
    colorVariants: row.color_variants || [],
    certifications: row.certifications || [],
  };
}

// === PRODUCTS SUPABASE QUERIES ===
export async function getSupabaseProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase getSupabaseProducts error:', error.message);
      return [];
    }
    if (Array.isArray(data)) {
      return data.map(mapRowToProduct);
    }
    return [];
  } catch (err) {
    console.error('Error fetching Supabase products:', err);
    return [];
  }
}

export async function createSupabaseProduct(p: Product): Promise<Product[]> {
  try {
    const row = mapProductToRow(p);
    const { data, error } = await supabase.from('products').insert([row]).select('*');
    if (error) {
      console.error('Supabase createSupabaseProduct error:', error.message);
      if (error.message?.includes('unique') || error.message?.includes('slug') || (error as any).code === '23505') {
        row.slug = `${row.slug}-${Date.now().toString().slice(-6)}`;
        const retry = await supabase.from('products').insert([row]).select('*');
        if (retry.error) {
          console.error('Supabase createSupabaseProduct retry error:', retry.error.message);
        } else {
          console.log('Successfully inserted product on slug retry:', retry.data);
        }
      }
    } else {
      console.log('Successfully inserted product into Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to create product in Supabase:', err);
  }
  return getSupabaseProducts();
}

export async function updateSupabaseProduct(id: string, updated: Partial<Product>): Promise<Product[]> {
  try {
    const patch: any = {};
    if (updated.name !== undefined) patch.name = updated.name;
    if (updated.model !== undefined) patch.model = updated.model;
    if (updated.slug !== undefined) patch.slug = updated.slug;
    if (updated.categorySlug !== undefined) patch.category_slug = updated.categorySlug;
    if (updated.categoryName !== undefined) patch.category_name = updated.categoryName;
    if (updated.shortDescription !== undefined) patch.short_description = updated.shortDescription;
    if (updated.description !== undefined) patch.description = updated.description;
    if (updated.price !== undefined) patch.price = updated.price;
    if (updated.compareAtPrice !== undefined) patch.compare_at_price = updated.compareAtPrice;
    if (updated.image !== undefined) patch.image_url = updated.image;
    if (updated.badge !== undefined) patch.badge = updated.badge;
    if (updated.featured !== undefined) patch.is_featured = updated.featured;
    if (updated.inStock !== undefined) patch.is_active = updated.inStock;

    if (isValidUUID(id)) {
      const { error } = await supabase.from('products').update(patch).eq('id', id);
      if (error) console.error('Supabase updateSupabaseProduct error:', error.message);
    } else {
      const { error } = await supabase.from('products').update(patch).eq('slug', updated.slug || id);
      if (error) console.error('Supabase updateSupabaseProduct by slug error:', error.message);
    }
  } catch (err) {
    console.error('Failed to update product in Supabase:', err);
  }
  return getSupabaseProducts();
}

export async function deleteSupabaseProduct(id: string): Promise<Product[]> {
  try {
    if (isValidUUID(id)) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) console.error('Supabase deleteSupabaseProduct error:', error.message);
    } else {
      const { error } = await supabase.from('products').delete().eq('slug', id);
      if (error) console.error('Supabase deleteSupabaseProduct by slug error:', error.message);
    }
  } catch (err) {
    console.error('Failed to delete product from Supabase:', err);
  }
  return getSupabaseProducts();
}

// === CATEGORIES SUPABASE QUERIES ===
export async function getSupabaseCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from('product_categories').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase getSupabaseCategories error:', error.message);
      return [];
    }
    if (Array.isArray(data)) {
      return data.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        image: c.image_url || '',
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching Supabase categories:', err);
    return [];
  }
}

export async function createSupabaseCategory(c: Category): Promise<Category[]> {
  try {
    const row: any = {
      name: c.name,
      slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: c.description || null,
      image_url: c.image || null,
    };
    if (isValidUUID(c.id)) {
      row.id = c.id;
    }
    const { data, error } = await supabase.from('product_categories').insert([row]).select('*');
    if (error) {
      console.error('Supabase createSupabaseCategory error:', error.message);
    } else {
      console.log('Successfully inserted category into Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to create category in Supabase:', err);
  }
  return getSupabaseCategories();
}

export async function updateSupabaseCategory(id: string, updated: Partial<Category>): Promise<Category[]> {
  try {
    const patch: any = {};
    if (updated.name !== undefined) patch.name = updated.name;
    if (updated.slug !== undefined) patch.slug = updated.slug;
    if (updated.description !== undefined) patch.description = updated.description;
    if (updated.image !== undefined) patch.image_url = updated.image;

    if (isValidUUID(id)) {
      const { error } = await supabase.from('product_categories').update(patch).eq('id', id);
      if (error) console.error('Supabase updateSupabaseCategory error:', error.message);
    } else {
      const { error } = await supabase.from('product_categories').update(patch).eq('slug', updated.slug || id);
      if (error) console.error('Supabase updateSupabaseCategory by slug error:', error.message);
    }
  } catch (err) {
    console.error('Failed to update category in Supabase:', err);
  }
  return getSupabaseCategories();
}

export async function deleteSupabaseCategory(id: string): Promise<Category[]> {
  try {
    if (isValidUUID(id)) {
      const { error } = await supabase.from('product_categories').delete().eq('id', id);
      if (error) console.error('Supabase deleteSupabaseCategory error:', error.message);
    } else {
      // Try deleting by exact ID match first
      const { data, error } = await supabase.from('product_categories').delete().eq('id', id).select();
      if (error || !data || data.length === 0) {
        // Fallback to slug matching if no record was deleted by id
        const { error: slugErr } = await supabase.from('product_categories').delete().eq('slug', id);
        if (slugErr) console.error('Supabase deleteSupabaseCategory by slug error:', slugErr.message);
      }
    }
  } catch (err) {
    console.error('Failed to delete category from Supabase:', err);
  }
  return getSupabaseCategories();
}

// === CUSTOMERS SUPABASE QUERIES ===
export async function getSupabaseCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase getSupabaseCustomers error:', error.message);
      return [];
    }
    if (Array.isArray(data)) {
      return data.map((cust) => ({
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone || '',
        city: cust.city || '',
        state: cust.state || '',
        pincode: cust.pincode || '',
        address: cust.address || '',
        ordersCount: cust.orders_count || 0,
        totalSpent: Number(cust.total_spent || 0),
        joinedDate: cust.created_at ? new Date(cust.created_at).toISOString().split('T')[0] : '2026-01-01',
        status: (cust.status as 'Active' | 'Inactive') || 'Active',
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching Supabase customers:', err);
    return [];
  }
}

export async function createSupabaseCustomer(c: Customer): Promise<Customer[]> {
  try {
    const row: any = {
      name: c.name,
      email: c.email,
      phone: c.phone || null,
      city: c.city || null,
      state: c.state || null,
      pincode: c.pincode || null,
      address: c.address || null,
      orders_count: c.ordersCount || 0,
      total_spent: c.totalSpent || 0,
      status: c.status || 'Active',
    };
    if (isValidUUID(c.id)) {
      row.id = c.id;
    }
    const { data, error } = await supabase.from('customers').insert([row]).select('*');
    if (error) {
      console.error('Supabase createSupabaseCustomer error:', error.message);
    } else {
      console.log('Successfully inserted customer into Supabase:', data);
    }
  } catch (err) {
    console.error('Failed to create customer in Supabase:', err);
  }
  return getSupabaseCustomers();
}

export async function updateSupabaseCustomer(id: string, updated: Partial<Customer>): Promise<Customer[]> {
  try {
    const patch: any = {};
    if (updated.name !== undefined) patch.name = updated.name;
    if (updated.email !== undefined) patch.email = updated.email;
    if (updated.phone !== undefined) patch.phone = updated.phone;
    if (updated.city !== undefined) patch.city = updated.city;
    if (updated.state !== undefined) patch.state = updated.state;
    if (updated.pincode !== undefined) patch.pincode = updated.pincode;
    if (updated.address !== undefined) patch.address = updated.address;
    if (updated.status !== undefined) patch.status = updated.status;

    if (isValidUUID(id)) {
      const { error } = await supabase.from('customers').update(patch).eq('id', id);
      if (error) console.error('Supabase updateSupabaseCustomer error:', error.message);
    } else {
      const { error } = await supabase.from('customers').update(patch).eq('email', updated.email || id);
      if (error) console.error('Supabase updateSupabaseCustomer by email error:', error.message);
    }
  } catch (err) {
    console.error('Failed to update customer in Supabase:', err);
  }
  return getSupabaseCustomers();
}

export async function deleteSupabaseCustomer(id: string): Promise<Customer[]> {
  try {
    if (isValidUUID(id)) {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) console.error('Supabase deleteSupabaseCustomer error:', error.message);
    } else {
      const { error } = await supabase.from('customers').delete().eq('email', id);
      if (error) console.error('Supabase deleteSupabaseCustomer by email error:', error.message);
    }
  } catch (err) {
    console.error('Failed to delete customer from Supabase:', err);
  }
  return getSupabaseCustomers();
}
