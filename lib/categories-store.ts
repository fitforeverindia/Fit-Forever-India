'use client';

import { useState, useEffect } from 'react';
import { SEED_CATEGORIES } from './data';
import type { Category } from './types';

const EVENT_NAME = 'fit_forever_categories_updated';

// Helper to broadcast changes locally for instant UI update
function broadcastCategories(categories: Category[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: categories }));
  }
}

export async function fetchDBCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories from DB API');
    const data = await res.json();
    return Array.isArray(data) ? data : SEED_CATEGORIES;
  } catch (err) {
    console.error('Error fetching categories from DB API:', err);
    return SEED_CATEGORIES;
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
    broadcastCategories(updated);
    return updated;
  } catch (err) {
    console.error('Error creating category in DB:', err);
    return SEED_CATEGORIES;
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
    broadcastCategories(updated);
    return updated;
  } catch (err) {
    console.error('Error updating category in DB:', err);
    return SEED_CATEGORIES;
  }
}

export async function deleteDBCategory(id: string): Promise<Category[]> {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    const updated = await res.json();
    broadcastCategories(updated);
    return updated;
  } catch (err) {
    console.error('Error deleting category in DB:', err);
    return SEED_CATEGORIES;
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
    broadcastCategories(updated);
    return updated;
  } catch (err) {
    console.error('Error resetting categories in DB:', err);
    return SEED_CATEGORIES;
  }
}

export function useCategoriesStore() {
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);

  const reloadCategories = async () => {
    const data = await fetchDBCategories();
    setCategories(data);
  };

  useEffect(() => {
    reloadCategories();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        reloadCategories();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  return {
    categories,
    setCategories,
    addCategory: async (cat: Category) => {
      const updated = await addDBCategory(cat);
      setCategories(updated);
    },
    updateCategory: async (id: string, data: Partial<Category>) => {
      const updated = await updateDBCategory(id, data);
      setCategories(updated);
    },
    deleteCategory: async (id: string) => {
      const updated = await deleteDBCategory(id);
      setCategories(updated);
    },
    resetCategories: async () => {
      const updated = await resetDBCategories();
      setCategories(updated);
    },
  };
}
