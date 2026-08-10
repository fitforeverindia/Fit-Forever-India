'use client';

import { useState, useEffect } from 'react';
import type { Category } from './types';

const EVENT_NAME = 'fit_forever_categories_updated';

function ensureArray(data: any): Category[] {
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

function broadcastCategories(categories: Category[]) {
  if (typeof window !== 'undefined') {
    const safeList = ensureArray(categories);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: safeList }));
  }
}

export async function fetchDBCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories from DB API');
    const data = await res.json();
    return ensureArray(data);
  } catch (err) {
    console.error('Error fetching categories from DB API:', err);
    return [];
  }
}

export async function addDBCategory(category: Category): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastCategories(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error creating category in DB:', err);
    return [];
  }
}

export async function updateDBCategory(id: string, updatedData: Partial<Category>): Promise<Category[]> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastCategories(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error updating category in DB:', err);
    return [];
  }
}

export async function deleteDBCategory(id: string): Promise<Category[]> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastCategories(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error deleting category in DB:', err);
    return [];
  }
}

export async function resetDBCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset: true }),
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastCategories(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error resetting categories in DB:', err);
    return [];
  }
}

export function useCategoriesStore() {
  const [categories, setCategories] = useState<Category[]>([]);

  const reloadCategories = async () => {
    const data = await fetchDBCategories();
    setCategories(ensureArray(data));
  };

  useEffect(() => {
    reloadCategories();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(ensureArray(e.detail));
      } else {
        reloadCategories();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  const safeList = ensureArray(categories);

  return {
    categories: safeList,
    setCategories: (cats: any) => setCategories(ensureArray(cats)),
    addCategory: async (cat: Category) => {
      const updated = await addDBCategory(cat);
      setCategories(ensureArray(updated));
    },
    updateCategory: async (id: string, data: Partial<Category>) => {
      const updated = await updateDBCategory(id, data);
      setCategories(ensureArray(updated));
    },
    deleteCategory: async (id: string) => {
      const updated = await deleteDBCategory(id);
      setCategories(ensureArray(updated));
    },
    resetCategories: async () => {
      const updated = await resetDBCategories();
      setCategories(ensureArray(updated));
    },
  };
}
