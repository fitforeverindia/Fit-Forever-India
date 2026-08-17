'use client';

import Link from 'next/link';
import { Layers } from 'lucide-react';
import { useCategoriesStore } from '@/lib/categories-store';
import type { Category } from '@/lib/types';

export function CategoryGrid({ categories: initialCategories }: { categories?: Category[] }) {
  const { categories: dynamicCategories } = useCategoriesStore();
  const rawCategories = initialCategories && initialCategories.length > 0 ? initialCategories : dynamicCategories;
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 sm:py-12 dark:bg-background">
      <div className="container-fit">
        {/* Header - Left Aligned Title */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Discover Your Favorites
          </span>
          <h2 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.15em] text-foreground sm:text-3xl lg:text-4xl">
            Explore by Category
          </h2>
        </div>

        {/* Uniform Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug || cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2.5 shadow-sm transition-all duration-300 active:scale-95 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.2)] dark:bg-muted dark:border-border sm:p-3.5"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl text-slate-400">
                  <Layers className="h-10 w-10" />
                </div>
              )}

              {/* Name badge */}
              <span className="absolute left-2 top-2 sm:left-3 sm:top-3 inline-flex items-center justify-start gap-1.5 whitespace-nowrap rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.18)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105 dark:bg-card/90 dark:border-border dark:text-foreground">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
