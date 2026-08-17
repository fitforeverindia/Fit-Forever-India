'use client';

import { useState, useEffect } from 'react';
import type { HeroSlide } from './types';

const EVENT_NAME = 'fit_forever_hero_slides_updated';

function ensureArray(data: any): HeroSlide[] {
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

function broadcastSlides(slides: HeroSlide[]) {
  if (typeof window !== 'undefined') {
    const safeList = ensureArray(slides);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: safeList }));
  }
}

export async function fetchDBHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch('/api/hero-slides', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch hero slides from DB API');
    const data = await res.json();
    return ensureArray(data);
  } catch (err) {
    console.error('Error fetching hero slides from DB API:', err);
    return [];
  }
}

export async function addDBHeroSlide(slide: Partial<HeroSlide>): Promise<HeroSlide[]> {
  try {
    const res = await fetch('/api/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide),
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastSlides(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error creating hero slide in DB:', err);
    return [];
  }
}

export async function updateDBHeroSlide(id: string, updatedData: Partial<HeroSlide>): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`/api/hero-slides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastSlides(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error updating hero slide in DB:', err);
    return [];
  }
}

export async function deleteDBHeroSlide(id: string): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`/api/hero-slides/${id}`, {
      method: 'DELETE',
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastSlides(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error deleting hero slide in DB:', err);
    return [];
  }
}

export function useHeroSlidesStore() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reloadSlides = async () => {
    const data = await fetchDBHeroSlides();
    setSlides(ensureArray(data));
    setLoaded(true);
  };

  useEffect(() => {
    reloadSlides();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setSlides(ensureArray(e.detail));
      } else {
        reloadSlides();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  const safeList = ensureArray(slides);

  return {
    slides: safeList,
    loaded,
    setSlides: (list: any) => setSlides(ensureArray(list)),
    addSlide: async (slide: Partial<HeroSlide>) => {
      const updated = await addDBHeroSlide(slide);
      setSlides(ensureArray(updated));
    },
    updateSlide: async (id: string, data: Partial<HeroSlide>) => {
      const updated = await updateDBHeroSlide(id, data);
      setSlides(ensureArray(updated));
    },
    deleteSlide: async (id: string) => {
      const updated = await deleteDBHeroSlide(id);
      setSlides(ensureArray(updated));
    },
  };
}
