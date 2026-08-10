'use client';

import { useState, useEffect } from 'react';
import { SEED_PRODUCTS } from './data';
import type { Product } from './types';

const EVENT_NAME = 'fit_forever_products_updated';

function broadcastProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: products }));
  }
}

export async function fetchDBProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products from DB API');
    const data = await res.json();
    return Array.isArray(data) ? data : SEED_PRODUCTS;
  } catch (err) {
    console.error('Error fetching products from DB API:', err);
    return SEED_PRODUCTS;
  }
}

export async function addDBProduct(product: Product): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const updated = await res.json();
    broadcastProducts(updated);
    return updated;
  } catch (err) {
    console.error('Error creating product in DB:', err);
    return SEED_PRODUCTS;
  }
}

export async function updateDBProduct(id: string, updatedData: Partial<Product>): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const updated = await res.json();
    broadcastProducts(updated);
    return updated;
  } catch (err) {
    console.error('Error updating product in DB:', err);
    return SEED_PRODUCTS;
  }
}

export async function deleteDBProduct(id: string): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    const updated = await res.json();
    broadcastProducts(updated);
    return updated;
  } catch (err) {
    console.error('Error deleting product in DB:', err);
    return SEED_PRODUCTS;
  }
}

export async function resetDBProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset: true }),
    });
    const updated = await res.json();
    broadcastProducts(updated);
    return updated;
  } catch (err) {
    console.error('Error resetting products in DB:', err);
    return SEED_PRODUCTS;
  }
}

export function useProductsStore() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);

  const reloadProducts = async () => {
    const data = await fetchDBProducts();
    setProducts(data);
  };

  useEffect(() => {
    reloadProducts();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProducts(e.detail);
      } else {
        reloadProducts();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  return {
    products,
    setProducts,
    addProduct: async (product: Product) => {
      const updated = await addDBProduct(product);
      setProducts(updated);
    },
    updateProduct: async (id: string, data: Partial<Product>) => {
      const updated = await updateDBProduct(id, data);
      setProducts(updated);
    },
    deleteProduct: async (id: string) => {
      const updated = await deleteDBProduct(id);
      setProducts(updated);
    },
    resetProducts: async () => {
      const updated = await resetDBProducts();
      setProducts(updated);
    },
  };
}
