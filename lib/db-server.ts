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

// 100% Dynamic Database Exports (Supabase Connected - No Local Static Files)

export const readDBCategoriesAsync = getSupabaseCategories;
export const readDBCategories = getSupabaseCategories;
export const createDBCategory = createSupabaseCategory;
export const updateDBCategory = updateSupabaseCategory;
export const deleteDBCategory = deleteSupabaseCategory;

export const readDBProductsAsync = getSupabaseProducts;
export const readDBProducts = getSupabaseProducts;
export const createDBProduct = createSupabaseProduct;
export const updateDBProduct = updateSupabaseProduct;
export const deleteDBProduct = deleteSupabaseProduct;

export const readDBCustomersAsync = getSupabaseCustomers;
export const readDBCustomers = getSupabaseCustomers;
export const createDBCustomer = createSupabaseCustomer;
export const updateDBCustomer = updateSupabaseCustomer;
export const deleteDBCustomer = deleteSupabaseCustomer;
