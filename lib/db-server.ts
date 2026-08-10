import fs from 'fs';
import path from 'path';
import type { Category, Product, Customer } from './types';
import {
  getSupabaseProducts,
  createSupabaseProduct,
  updateSupabaseProduct,
  deleteSupabaseProduct,
  getSupabaseCategories,
  createSupabaseCategory,
  updateSupabaseCategory,
  deleteSupabaseCategory,
  getSupabaseCustomers,
  createSupabaseCustomer,
  updateSupabaseCustomer,
  deleteSupabaseCustomer,
} from './supabase-db';

const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// === CATEGORIES DB API (SUPABASE CONNECTED) ===
export async function readDBCategoriesAsync(): Promise<Category[]> {
  const supabaseCategories = await getSupabaseCategories();
  if (Array.isArray(supabaseCategories)) {
    try {
      ensureDataDir();
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(supabaseCategories, null, 2), 'utf-8');
    } catch (e) {}
    return supabaseCategories;
  }
  return readDBCategories();
}

export function readDBCategories(): Category[] {
  ensureDataDir();
  if (!fs.existsSync(CATEGORIES_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function writeDBCategories(categories: Category[]): void {
  ensureDataDir();
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
}

export async function createDBCategory(category: Category): Promise<Category[]> {
  const current = readDBCategories();
  const updated = [category, ...current];
  writeDBCategories(updated);
  return await createSupabaseCategory(category);
}

export async function updateDBCategory(id: string, updatedData: Partial<Category>): Promise<Category[]> {
  const current = readDBCategories();
  const updated = current.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
  writeDBCategories(updated);
  return await updateSupabaseCategory(id, updatedData);
}

export async function deleteDBCategory(id: string): Promise<Category[]> {
  const current = readDBCategories();
  const updated = current.filter((c) => c.id !== id);
  writeDBCategories(updated);
  return await deleteSupabaseCategory(id);
}

export function resetDBCategories(): Category[] {
  writeDBCategories([]);
  return [];
}

// === PRODUCTS DB API (SUPABASE CONNECTED) ===
export async function readDBProductsAsync(): Promise<Product[]> {
  const supabaseProducts = await getSupabaseProducts();
  if (Array.isArray(supabaseProducts)) {
    try {
      ensureDataDir();
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(supabaseProducts, null, 2), 'utf-8');
    } catch (e) {}
    return supabaseProducts;
  }
  return readDBProducts();
}

export function readDBProducts(): Product[] {
  ensureDataDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function writeDBProducts(products: Product[]): void {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export async function createDBProduct(product: Product): Promise<Product[]> {
  const current = readDBProducts();
  const updated = [product, ...current];
  writeDBProducts(updated);
  return await createSupabaseProduct(product);
}

export async function updateDBProduct(id: string, updatedData: Partial<Product>): Promise<Product[]> {
  const current = readDBProducts();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
  writeDBProducts(updated);
  return await updateSupabaseProduct(id, updatedData);
}

export async function deleteDBProduct(id: string): Promise<Product[]> {
  const current = readDBProducts();
  const updated = current.filter((p) => p.id !== id);
  writeDBProducts(updated);
  return await deleteSupabaseProduct(id);
}

export function resetDBProducts(): Product[] {
  writeDBProducts([]);
  return [];
}

// === CUSTOMERS DB API (SUPABASE CONNECTED) ===
export async function readDBCustomersAsync(): Promise<Customer[]> {
  const supabaseCustomers = await getSupabaseCustomers();
  if (Array.isArray(supabaseCustomers)) {
    try {
      ensureDataDir();
      fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(supabaseCustomers, null, 2), 'utf-8');
    } catch (e) {}
    return supabaseCustomers;
  }
  return readDBCustomers();
}

export function readDBCustomers(): Customer[] {
  ensureDataDir();
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function writeDBCustomers(customers: Customer[]): void {
  ensureDataDir();
  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
}

export async function createDBCustomer(customer: Customer): Promise<Customer[]> {
  const current = readDBCustomers();
  const updated = [customer, ...current];
  writeDBCustomers(updated);
  return await createSupabaseCustomer(customer);
}

export async function updateDBCustomer(id: string, updatedData: Partial<Customer>): Promise<Customer[]> {
  const current = readDBCustomers();
  const updated = current.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
  writeDBCustomers(updated);
  return await updateSupabaseCustomer(id, updatedData);
}

export async function deleteDBCustomer(id: string): Promise<Customer[]> {
  const current = readDBCustomers();
  const updated = current.filter((c) => c.id !== id);
  writeDBCustomers(updated);
  return await deleteSupabaseCustomer(id);
}
