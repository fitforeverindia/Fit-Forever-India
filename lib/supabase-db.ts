import { createClient } from '@supabase/supabase-js';
import type { Category, Product, Customer, SavedAddress, Order, OrderItemDetail } from './types';

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
// Fields shared by create/update that map 1:1 from Product (camelCase) to DB row (snake_case)
function mapProductSpecFields(p: Partial<Product>): any {
  const row: any = {};
  if (p.categorySlug !== undefined) row.category_slug = p.categorySlug || null;
  if (p.categoryName !== undefined) row.category_name = p.categoryName || null;

  if (p.ratedVoltage !== undefined) row.rated_voltage = p.ratedVoltage || null;
  if (p.ratedFrequency !== undefined) row.rated_frequency = p.ratedFrequency || null;
  if (p.ratedPower !== undefined) row.rated_power = p.ratedPower || null;
  if (p.safetyClass !== undefined) row.safety_class = p.safetyClass || null;
  if (p.ratedTime !== undefined) row.rated_time = p.ratedTime || null;
  if (p.noiseLevel !== undefined) row.noise_level = p.noiseLevel || null;
  if (p.airPressure !== undefined) row.air_pressure = p.airPressure || null;

  if (p.netWeight !== undefined) row.net_weight = p.netWeight || null;
  if (p.grossWeight !== undefined) row.gross_weight = p.grossWeight || null;
  if (p.dimensionsSitUp !== undefined) row.dimensions_sit_up = p.dimensionsSitUp || null;
  if (p.dimensionsLayDown !== undefined) row.dimensions_lay_down = p.dimensionsLayDown || null;
  if (p.packageSize !== undefined) row.package_size = p.packageSize || null;

  if (p.containerQty !== undefined) row.container_qty = p.containerQty || null;

  if (p.massageTechniques !== undefined) row.massage_techniques = p.massageTechniques || null;
  if (p.autoProgramsCount !== undefined) row.auto_programs_count = p.autoProgramsCount || null;
  if (p.railType !== undefined) row.rail_type = p.railType || null;
  if (p.aiBodyDetection !== undefined) row.ai_body_detection = p.aiBodyDetection || null;
  if (p.heating !== undefined) row.heating = p.heating || null;
  if (p.airbagZones !== undefined) row.airbag_zones = p.airbagZones || null;
  if (p.voiceControl !== undefined) row.voice_control = p.voiceControl || null;
  if (p.bluetoothSpeaker !== undefined) row.bluetooth_speaker = p.bluetoothSpeaker || null;
  if (p.remoteType !== undefined) row.remote_type = p.remoteType || null;
  if (p.charging !== undefined) row.charging = p.charging || null;

  if (p.certifications !== undefined) row.certifications = p.certifications || [];
  if (p.colorVariants !== undefined) row.color_variants = p.colorVariants || [];
  if (p.sizes !== undefined) row.sizes = p.sizes || [];
  if (p.colors !== undefined) row.colors = p.colors || [];
  if (p.specifications !== undefined) row.specifications = p.specifications || [];

  return row;
}

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
    ...mapProductSpecFields(p),
  };

  if (isValidUUID(p.id)) {
    row.id = p.id;
  }

  return row;
}

function mapRowToProduct(row: any): Product {
  const cat = Array.isArray(row.product_categories)
    ? row.product_categories[0]
    : row.product_categories || null;

  return {
    id: row.id,
    name: row.name,
    model: row.model || undefined,
    slug: row.slug,
    categorySlug: cat?.slug || row.category_slug || 'massage-chairs',
    categoryName: cat?.name || row.category_name || 'Massage Chairs',
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
    sizes: row.sizes || [],
    colors: row.colors || [],
    specifications: row.specifications || [],

    ratedVoltage: row.rated_voltage || undefined,
    ratedFrequency: row.rated_frequency || undefined,
    ratedPower: row.rated_power || undefined,
    safetyClass: row.safety_class || undefined,
    ratedTime: row.rated_time || undefined,
    noiseLevel: row.noise_level || undefined,
    airPressure: row.air_pressure || undefined,

    netWeight: row.net_weight || undefined,
    grossWeight: row.gross_weight || undefined,
    dimensionsSitUp: row.dimensions_sit_up || undefined,
    dimensionsLayDown: row.dimensions_lay_down || undefined,
    packageSize: row.package_size || undefined,

    containerQty: row.container_qty || undefined,

    massageTechniques: row.massage_techniques || undefined,
    autoProgramsCount: row.auto_programs_count || undefined,
    railType: row.rail_type || undefined,
    aiBodyDetection: row.ai_body_detection || undefined,
    heating: row.heating || undefined,
    airbagZones: row.airbag_zones || undefined,
    voiceControl: row.voice_control || undefined,
    bluetoothSpeaker: row.bluetooth_speaker || undefined,
    remoteType: row.remote_type || undefined,
    charging: row.charging || undefined,
  };
}

// === PRODUCTS SUPABASE QUERIES ===
export async function getSupabaseProducts(): Promise<Product[]> {
  try {
    let { data, error } = await supabase
      .from('products')
      .select('*, product_categories(id, name, slug)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getSupabaseProducts join query warning:', error.message);
      const fallback = await supabase.from('products').select('*').order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

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

async function getCategoryIdBySlug(slug?: string, name?: string): Promise<string | null> {
  if (!slug) return null;
  try {
    const { data } = await supabase.from('product_categories').select('id').eq('slug', slug).maybeSingle();
    if (data?.id) return data.id;

    // Auto-create category in product_categories if missing in Supabase
    const catName = name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const { data: created } = await supabase.from('product_categories').insert([{ name: catName, slug }]).select('id').single();
    if (created?.id) return created.id;
  } catch (e) {}
  return null;
}

export async function createSupabaseProduct(p: Product): Promise<Product[]> {
  try {
    const catId = await getCategoryIdBySlug(p.categorySlug, p.categoryName);

    // 1. Standard row matching standard Supabase products schema
    const baseRow: any = {
      name: p.name,
      model: p.model || null,
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() : 'product-' + Date.now()),
      short_description: p.shortDescription || null,
      description: p.description || null,
      price: Number(p.price || 0),
      compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      image_url: p.image || null,
      gallery_urls: p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
      rating: Number(p.rating || 5.0),
      review_count: Number(p.reviewCount || 0),
      badge: p.badge || null,
      is_featured: p.featured ?? true,
      is_active: p.inStock ?? true,
      ...mapProductSpecFields(p),
    };

    if (catId) {
      baseRow.category_id = catId;
    }

    if (isValidUUID(p.id)) {
      baseRow.id = p.id;
    }

    // Attempt 1: Insert standard baseRow
    let { data, error } = await supabase.from('products').insert([baseRow]).select('*');

    // Attempt 2: If insert failed with category_slug/category_name column support
    if (error) {
      console.warn('Supabase insert attempt 1 error:', error.message);
      const rowWithCategoryStrings = {
        ...baseRow,
        category_slug: p.categorySlug || null,
        category_name: p.categoryName || null,
      };
      const try2 = await supabase.from('products').insert([rowWithCategoryStrings]).select('*');
      if (!try2.error && try2.data) {
        data = try2.data;
        error = null;
      }
    }

    // Attempt 3: If explicit ID failed, delete row.id and let DB generate UUID primary key
    if (error && baseRow.id) {
      console.warn('Retrying insert without explicit ID...');
      delete baseRow.id;
      const try3 = await supabase.from('products').insert([baseRow]).select('*');
      if (!try3.error && try3.data) {
        data = try3.data;
        error = null;
      }
    }

    // Attempt 4: If duplicate slug conflict, append timestamp suffix
    if (error && (error.message?.includes('unique') || error.message?.includes('slug') || (error as any).code === '23505')) {
      console.warn('Retrying insert with unique timestamped slug...');
      baseRow.slug = `${baseRow.slug}-${Date.now().toString().slice(-6)}`;
      delete baseRow.id;
      const try4 = await supabase.from('products').insert([baseRow]).select('*');
      if (!try4.error && try4.data) {
        data = try4.data;
        error = null;
      }
    }

    if (error) {
      console.error('Supabase createSupabaseProduct final error:', error.message);
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
    if (updated.shortDescription !== undefined) patch.short_description = updated.shortDescription;
    if (updated.description !== undefined) patch.description = updated.description;
    if (updated.price !== undefined) patch.price = Number(updated.price);
    if (updated.compareAtPrice !== undefined) patch.compare_at_price = updated.compareAtPrice ? Number(updated.compareAtPrice) : null;
    if (updated.image !== undefined) patch.image_url = updated.image;
    if (updated.badge !== undefined) patch.badge = updated.badge;
    if (updated.featured !== undefined) patch.is_featured = updated.featured;
    if (updated.inStock !== undefined) patch.is_active = updated.inStock;
    Object.assign(patch, mapProductSpecFields(updated));

    if (updated.categorySlug) {
      const catId = await getCategoryIdBySlug(updated.categorySlug, updated.categoryName);
      if (catId) patch.category_id = catId;
    }

    let res: any;
    if (isValidUUID(id)) {
      res = await supabase.from('products').update(patch).eq('id', id).select('*');
    } else {
      // Find existing product by ID or slug first to target the exact row by ID
      const { data: existing } = await supabase.from('products').select('id, slug').or(`id.eq.${id},slug.eq.${id}`).maybeSingle();
      if (existing?.id) {
        res = await supabase.from('products').update(patch).eq('id', existing.id).select('*');
      } else {
        res = await supabase.from('products').update(patch).eq('slug', id).select('*');
      }
    }

    if (res.error) {
      console.error('Supabase updateSupabaseProduct error:', res.error.message);
    }

    // Only create a new product if query succeeded without error AND no existing product was matched
    if (!res.error && (!res.data || res.data.length === 0)) {
      console.log(`Product with id/slug "${id}" not found in Supabase during update. Inserting as new product...`);
      const fullProductToCreate: Product = {
        id: isValidUUID(id) ? id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`),
        name: updated.name || 'Updated Product',
        model: updated.model,
        slug: updated.slug || (typeof id === 'string' && id.length > 2 ? id : `prod-${Date.now()}`),
        categorySlug: updated.categorySlug || 'massage-chairs',
        categoryName: updated.categoryName || 'Massage Chairs',
        price: updated.price ? Number(updated.price) : 0,
        compareAtPrice: updated.compareAtPrice ? Number(updated.compareAtPrice) : null,
        shortDescription: updated.shortDescription || null,
        description: updated.description || null,
        image: updated.image || '',
        gallery: updated.gallery || [],
        rating: updated.rating || 5.0,
        reviewCount: updated.reviewCount || 0,
        badge: updated.badge || null,
        featured: updated.featured ?? true,
        inStock: updated.inStock ?? true,
      };
      await createSupabaseProduct(fullProductToCreate);
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

// === CUSTOMER DASHBOARD SUPABASE HELPER FUNCTIONS ===

export async function getCustomerById(customerId: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .maybeSingle();

    if (error) {
      console.error('Error getting customer by ID:', error.message);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      address: data.address || '',
      ordersCount: data.orders_count || 0,
      totalSpent: Number(data.total_spent || 0),
      joinedDate: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : '2026-01-01',
      status: (data.status as 'Active' | 'Inactive') || 'Active',
      orderUpdates: data.order_updates ?? true,
      promoNotifications: data.promo_notifications ?? false,
    };
  } catch (err) {
    console.error('Error in getCustomerById:', err);
    return null;
  }
}

export async function getSavedAddresses(customerId: string): Promise<SavedAddress[]> {
  try {
    const { data, error } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error.message);
      return [];
    }

    return (data || []).map((addr: any) => ({
      id: addr.id,
      customerId: addr.customer_id,
      addressType: addr.address_type,
      fullName: addr.full_name,
      phoneNumber: addr.phone_number,
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pin_code,
      isDefault: addr.is_default,
    }));
  } catch (err) {
    console.error('Error in getSavedAddresses:', err);
    return [];
  }
}

export async function createSavedAddress(customerId: string, address: Omit<SavedAddress, 'id'>): Promise<SavedAddress[]> {
  try {
    if (address.isDefault) {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customerId);
    }

    const { error } = await supabase.from('customer_addresses').insert([{
      customer_id: customerId,
      address_type: address.addressType,
      full_name: address.fullName,
      phone_number: address.phoneNumber,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2 || null,
      city: address.city,
      state: address.state,
      pin_code: address.pinCode,
      is_default: address.isDefault,
    }]);

    if (error) {
      console.error('Error creating address:', error.message);
    }
  } catch (err) {
    console.error('Error in createSavedAddress:', err);
  }
  return getSavedAddresses(customerId);
}

export async function updateSavedAddress(customerId: string, addressId: string, updated: Partial<SavedAddress>): Promise<SavedAddress[]> {
  try {
    if (updated.isDefault) {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customerId);
    }

    const patch: any = {};
    if (updated.addressType !== undefined) patch.address_type = updated.addressType;
    if (updated.fullName !== undefined) patch.full_name = updated.fullName;
    if (updated.phoneNumber !== undefined) patch.phone_number = updated.phoneNumber;
    if (updated.addressLine1 !== undefined) patch.address_line1 = updated.addressLine1;
    if (updated.addressLine2 !== undefined) patch.address_line2 = updated.addressLine2 || null;
    if (updated.city !== undefined) patch.city = updated.city;
    if (updated.state !== undefined) patch.state = updated.state;
    if (updated.pinCode !== undefined) patch.pin_code = updated.pinCode;
    if (updated.isDefault !== undefined) patch.is_default = updated.isDefault;

    const { error } = await supabase
      .from('customer_addresses')
      .update(patch)
      .eq('id', addressId);

    if (error) {
      console.error('Error updating address:', error.message);
    }
  } catch (err) {
    console.error('Error in updateSavedAddress:', err);
  }
  return getSavedAddresses(customerId);
}

export async function deleteSavedAddress(customerId: string, addressId: string): Promise<SavedAddress[]> {
  try {
    const { error } = await supabase
      .from('customer_addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      console.error('Error deleting address:', error.message);
    }
  } catch (err) {
    console.error('Error in deleteSavedAddress:', err);
  }
  return getSavedAddresses(customerId);
}

export async function setDefaultAddress(customerId: string, addressId: string): Promise<SavedAddress[]> {
  try {
    await supabase
      .from('customer_addresses')
      .update({ is_default: false })
      .eq('customer_id', customerId);

    await supabase
      .from('customer_addresses')
      .update({ is_default: true })
      .eq('id', addressId);
  } catch (err) {
    console.error('Error in setDefaultAddress:', err);
  }
  return getSavedAddresses(customerId);
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error.message);
      return [];
    }

    return (data || []).map((ord: any) => ({
      id: ord.id,
      customerId: ord.customer_id,
      status: ord.status,
      subtotal: Number(ord.subtotal),
      shipping: Number(ord.shipping),
      discount: Number(ord.discount),
      total: Number(ord.total),
      shippingName: ord.shipping_name,
      shippingPhone: ord.shipping_phone,
      shippingAddressLine1: ord.shipping_address_line1,
      shippingAddressLine2: ord.shipping_address_line2,
      shippingCity: ord.shipping_city,
      shippingState: ord.shipping_state,
      shippingPinCode: ord.shipping_pin_code,
      createdAt: ord.created_at,
      items: (ord.order_items || []).map((item: any) => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        productName: item.products?.name || 'Premium Massage Chair',
        productImage: item.products?.image_url || '',
      })),
    }));
  } catch (err) {
    console.error('Error in getCustomerOrders:', err);
    return [];
  }
}

export async function getCustomerOrderById(orderId: string, customerId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .eq('customer_id', customerId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order by ID:', error.message);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      customerId: data.customer_id,
      status: data.status,
      subtotal: Number(data.subtotal),
      shipping: Number(data.shipping),
      discount: Number(data.discount),
      total: Number(data.total),
      shippingName: data.shipping_name,
      shippingPhone: data.shipping_phone,
      shippingAddressLine1: data.shipping_address_line1,
      shippingAddressLine2: data.shipping_address_line2,
      shippingCity: data.shipping_city,
      shippingState: data.shipping_state,
      shippingPinCode: data.shipping_pin_code,
      createdAt: data.created_at,
      items: (data.order_items || []).map((item: any) => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        productName: item.products?.name || 'Premium Massage Chair',
        productImage: item.products?.image_url || '',
      })),
    };
  } catch (err) {
    console.error('Error in getCustomerOrderById:', err);
    return null;
  }
}

export async function createCustomerOrder(
  orderId: string,
  customerId: string,
  orderData: Omit<Order, 'id' | 'customerId' | 'createdAt'>,
  items: Omit<OrderItemDetail, 'id' | 'orderId'>[]
): Promise<void> {
  try {
    const { error: orderError } = await supabase.from('orders').insert([{
      id: orderId,
      customer_id: customerId,
      status: orderData.status,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      discount: orderData.discount,
      total: orderData.total,
      shipping_name: orderData.shippingName,
      shipping_phone: orderData.shippingPhone,
      shipping_address_line1: orderData.shippingAddressLine1,
      shipping_address_line2: orderData.shippingAddressLine2 || null,
      shipping_city: orderData.shippingCity,
      shipping_state: orderData.shippingState,
      shipping_pin_code: orderData.shippingPinCode,
    }]);

    if (orderError) {
      throw new Error(`Order insertion error: ${orderError.message}`);
    }

    const itemRows = items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
    if (itemsError) {
      throw new Error(`Order items insertion error: ${itemsError.message}`);
    }
  } catch (err) {
    console.error('Error in createCustomerOrder:', err);
    throw err;
  }
}

export async function updateCustomerPreferences(
  customerId: string,
  orderUpdates: boolean,
  promoNotifications: boolean
): Promise<void> {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        order_updates: orderUpdates,
        promo_notifications: promoNotifications,
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error updating customer preferences:', error.message);
    }
  } catch (err) {
    console.error('Error in updateCustomerPreferences:', err);
  }
}

export async function updateCustomerProfile(
  customerId: string,
  name: string,
  phone: string,
  email: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        name,
        phone,
        email,
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error updating customer profile:', error.message);
    }
  } catch (err) {
    console.error('Error in updateCustomerProfile:', err);
  }
}

