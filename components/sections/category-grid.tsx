'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { useCategoriesStore } from '@/lib/categories-store';
import type { Category } from '@/lib/types';

export function CategoryGrid({ categories: initialCategories }: { categories?: Category[] }) {
  const { categories: dynamicCategories } = useCategoriesStore();
  const rawCategories = initialCategories && initialCategories.length > 0 ? initialCategories : dynamicCategories;
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Avoid unnecessary duplication when categories list is small
  const displayCategories = categories.length > 3
    ? [...categories, ...categories, ...categories]
    : categories;

  // Auto-scroll effect optimized for 60-120fps GPU performance
  useEffect(() => {
    if (displayCategories.length <= 4) return;

    // Disable JS scroll loop on mobile touch devices to allow 100% native 120Hz GPU touch scrolling without hanging
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isTouch) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (scrollRef.current && !isPaused) {
        scrollRef.current.scrollLeft += deltaTime * 0.035;

        const halfWidth = scrollRef.current.scrollWidth / 2;
        if (scrollRef.current.scrollLeft >= halfWidth) {
          scrollRef.current.scrollLeft -= halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, displayCategories.length]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    setIsPaused(true);

    const container = scrollRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const scrollAmount = isMobile ? 180 : 280;
    const targetLeft = direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });

    setTimeout(() => {
      setIsPaused(false);
    }, 1200);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F4F5F7] py-8 sm:py-12 dark:bg-muted/30 overflow-hidden">
      <div className="container-fit">
        {/* Header - Left Aligned Title */}
        <div className="flex flex-row items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              EXPLORE OUR RANGE
            </span>
            <h2 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.15em] text-foreground sm:text-3xl lg:text-4xl">
              CATEGORIES
            </h2>
          </div>

          {/* Manual Scroll Controls - Always Available */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleManualScroll('left')}
              aria-label="Previous categories"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-foreground shadow-sm transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95 dark:bg-card dark:border-border"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              aria-label="Next categories"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-foreground shadow-sm transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-95 dark:bg-card dark:border-border"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative mt-8 sm:mt-10 w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className={`flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto scrollbar-none py-2 scroll-smooth touch-pan-x overscroll-x-contain ${
              categories.length <= 4 ? 'justify-start sm:justify-center' : ''
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {displayCategories.map((cat, idx) => (
              <Link
                key={`${cat.slug || cat.id}-${idx}`}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 w-28 sm:w-36 lg:w-40 text-center cursor-pointer select-none"
              >
                {/* Circular Avatar Frame - Full Edge Cover */}
                <div className="relative aspect-square w-full rounded-full bg-white shadow-sm border border-slate-200 p-1 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-primary dark:bg-card dark:border-border overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Layers className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <span className="mt-3 font-display font-bold text-xs sm:text-sm text-foreground tracking-wide group-hover:text-primary transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
