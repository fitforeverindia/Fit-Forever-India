import fs from 'fs';
import path from 'path';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_CUSTOMERS } from './data';
import type { Category, Product, Customer } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

// Ensure database data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// === CATEGORIES DB API ===
export function readDBCategories(): Category[] {
  ensureDataDir();
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(SEED_CATEGORIES, null, 2), 'utf-8');
    return SEED_CATEGORIES;
  }
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_CATEGORIES;
  } catch (err) {
    console.error('Error reading categories DB:', err);
    return SEED_CATEGORIES;
  }
}

export function writeDBCategories(categories: Category[]): void {
  ensureDataDir();
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
}

export function createDBCategory(category: Category): Category[] {
  const current = readDBCategories();
  const updated = [category, ...current];
  writeDBCategories(updated);
  return updated;
}

export function updateDBCategory(id: string, updatedData: Partial<Category>): Category[] {
  const current = readDBCategories();
  const updated = current.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
  writeDBCategories(updated);
  return updated;
}

export function deleteDBCategory(id: string): Category[] {
  const current = readDBCategories();
  const updated = current.filter((c) => c.id !== id);
  writeDBCategories(updated);
  return updated;
}

export function resetDBCategories(): Category[] {
  writeDBCategories(SEED_CATEGORIES);
  return SEED_CATEGORIES;
}

// === PRODUCTS DB API ===
export function readDBProducts(): Product[] {
  ensureDataDir();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(SEED_PRODUCTS, null, 2), 'utf-8');
    return SEED_PRODUCTS;
  }
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_PRODUCTS;
  } catch (err) {
    console.error('Error reading products DB:', err);
    return SEED_PRODUCTS;
  }
}

export function writeDBProducts(products: Product[]): void {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export function createDBProduct(product: Product): Product[] {
  const current = readDBProducts();
  const updated = [product, ...current];
  writeDBProducts(updated);
  return updated;
}

export function updateDBProduct(id: string, updatedData: Partial<Product>): Product[] {
  const current = readDBProducts();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
  writeDBProducts(updated);
  return updated;
}

export function deleteDBProduct(id: string): Product[] {
  const current = readDBProducts();
  const updated = current.filter((p) => p.id !== id);
  writeDBProducts(updated);
  return updated;
}

export function resetDBProducts(): Product[] {
  writeDBProducts(SEED_PRODUCTS);
  return SEED_PRODUCTS;
}

// === CUSTOMERS DB API ===
export function readDBCustomers(): Customer[] {
  ensureDataDir();
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(SEED_CUSTOMERS, null, 2), 'utf-8');
    return SEED_CUSTOMERS;
  }
  try {
    const raw = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_CUSTOMERS;
  } catch (err) {
    console.error('Error reading customers DB:', err);
    return SEED_CUSTOMERS;
  }
}

export function writeDBCustomers(customers: Customer[]): void {
  ensureDataDir();
  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
}

export function createDBCustomer(customer: Customer): Customer[] {
  const current = readDBCustomers();
  const updated = [customer, ...current];
  writeDBCustomers(updated);
  return updated;
}

export function updateDBCustomer(id: string, updatedData: Partial<Customer>): Customer[] {
  const current = readDBCustomers();
  const updated = current.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
  writeDBCustomers(updated);
  return updated;
}

export function deleteDBCustomer(id: string): Customer[] {
  const current = readDBCustomers();
  const updated = current.filter((c) => c.id !== id);
  writeDBCustomers(updated);
  return updated;
}

