'use client';

import { useState, useEffect } from 'react';
import type { Product } from './types';

const EVENT_NAME = 'fit_forever_products_updated';

function ensureArray(data: any): Product[] {
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

function broadcastProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    const safeList = ensureArray(products);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: safeList }));
  }
}

export async function fetchDBProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products from DB API');
    const data = await res.json();
    return ensureArray(data);
  } catch (err) {
    console.error('Error fetching products from DB API:', err);
    return [];
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
    const safeUpdated = ensureArray(updated);
    broadcastProducts(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error creating product in DB:', err);
    return [];
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
    const safeUpdated = ensureArray(updated);
    broadcastProducts(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error updating product in DB:', err);
    return [];
  }
}

export async function deleteDBProduct(id: string): Promise<Product[]> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastProducts(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error deleting product in DB:', err);
    return [];
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
    const safeUpdated = ensureArray(updated);
    broadcastProducts(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error resetting products in DB:', err);
    return [];
  }
}

export function useProductsStore() {
  const [products, setProducts] = useState<Product[]>([]);

  const reloadProducts = async () => {
    const data = await fetchDBProducts();
    setProducts(ensureArray(data));
  };

  useEffect(() => {
    reloadProducts();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProductsState(e.detail);
      } else {
        reloadProducts();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  function setProductsState(list: any) {
    setProducts(ensureArray(list));
  }

  const safeList = ensureArray(products);

  return {
    products: safeList,
    setProducts: (prods: any) => setProducts(ensureArray(prods)),
    addProduct: async (product: Product) => {
      const updated = await addDBProduct(product);
      setProducts(ensureArray(updated));
    },
    updateProduct: async (id: string, data: Partial<Product>) => {
      const updated = await updateDBProduct(id, data);
      setProducts(ensureArray(updated));
    },
    deleteProduct: async (id: string) => {
      const updated = await deleteDBProduct(id);
      setProducts(ensureArray(updated));
    },
    resetProducts: async () => {
      const updated = await resetDBProducts();
      setProducts(ensureArray(updated));
    },
  };
}
