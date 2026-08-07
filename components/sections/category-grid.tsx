'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Category } from '@/lib/types';

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate categories array to ensure seamless infinite sliding loop
  const duplicatedCategories = [...categories, ...categories, ...categories, ...categories];

  // Auto-scroll effect with pause on hover/interaction
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (scrollRef.current && !isPaused) {
        // Continuous smooth auto-scroll (~45px per sec)
        scrollRef.current.scrollLeft += (deltaTime * 0.045);

        // Infinite loop reset seamlessly
        const halfWidth = scrollRef.current.scrollWidth / 2;
        if (scrollRef.current.scrollLeft >= halfWidth) {
          scrollRef.current.scrollLeft -= halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // Manual Prev / Next controls
  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 260;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-[#F4F5F7] py-8 sm:py-12 dark:bg-muted/30 overflow-hidden">
      <div className="container-fit">
        {/* Header - Left Aligned Title + Font Display + Manual Controls */}
        <div className="flex flex-row items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              EXPLORE OUR RANGE
            </span>
            <h2 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.15em] text-foreground sm:text-3xl lg:text-4xl">
              CATEGORIES
            </h2>
          </div>

          {/* Manual Swap Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleManualScroll('left')}
              aria-label="Previous categories"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-foreground shadow-sm transition-all hover:bg-primary hover:text-white hover:border-primary dark:bg-card dark:border-border"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              aria-label="Next categories"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-foreground shadow-sm transition-all hover:bg-primary hover:text-white hover:border-primary dark:bg-card dark:border-border"
            >
              <ChevronRight className="h-5 w-5" />
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
          {/* Gradient fade on edges for smooth visual transition */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 sm:w-16 bg-gradient-to-r from-[#F4F5F7] to-transparent dark:from-background" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 sm:w-16 bg-gradient-to-l from-[#F4F5F7] to-transparent dark:from-background" />

          {/* Scrollable Container with Hidden Scrollbar */}
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto scrollbar-none py-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedCategories.map((cat, idx) => (
              <Link
                key={`${cat.slug}-${idx}`}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 w-32 sm:w-40 lg:w-44 text-center cursor-pointer select-none"
              >
                {/* Smaller Sleeker Circular Image Container */}
                <div className="relative aspect-square w-full rounded-full bg-white shadow-sm border border-slate-100 p-2.5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md dark:bg-card dark:border-border overflow-hidden flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Category Name with font-display */}
                <span className="mt-3.5 font-display font-bold text-sm sm:text-base text-foreground tracking-wide group-hover:text-primary transition-colors line-clamp-1">
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



