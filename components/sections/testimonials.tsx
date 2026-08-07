'use client';

import { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate array for seamless infinite sliding animation
  const duplicatedTestimonials = [
    ...TESTIMONIALS,
    ...TESTIMONIALS,
    ...TESTIMONIALS,
    ...TESTIMONIALS,
  ];

  // Auto-scroll loop effect
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (scrollRef.current && !isPaused) {
        // Continuous smooth auto-scroll (~40px per sec)
        scrollRef.current.scrollLeft += (deltaTime * 0.04);

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

  // Manual scroll controls
  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-[#F8F9FA] py-8 sm:py-12 dark:bg-muted/20 overflow-hidden">
      <div className="container-fit flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            TESTIMONIALS
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted By Thousands Across India
          </h2>
        </div>

        {/* Manual Swap Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleManualScroll('left')}
            aria-label="Previous testimonials"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition-all hover:bg-primary hover:text-white hover:border-primary dark:bg-card dark:border-border dark:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            aria-label="Next testimonials"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition-all hover:bg-primary hover:text-white hover:border-primary dark:bg-card dark:border-border dark:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="relative mt-10 sm:mt-12 w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Gradient edge fades for smooth transition */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-[#F8F9FA] to-transparent dark:from-background" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-[#F8F9FA] to-transparent dark:from-background" />

        {/* Scrollable Container with Hidden Scrollbar */}
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-2 px-4 sm:px-8 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedTestimonials.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="flex flex-col justify-between w-[300px] sm:w-[360px] shrink-0 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-card dark:border-border select-none"
            >
              <div>
                {/* Title */}
                <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-foreground">
                  {t.title ?? 'Trusted by Customers'}
                </h3>

                {/* Review Quote */}
                <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600 dark:text-muted-foreground line-clamp-3">
                  {t.quote}
                </p>

                {/* 5 Star Rating */}
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: t.rating ?? 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Tag Pill Badge */}
                <div className="mt-4">
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-muted dark:text-muted-foreground">
                    {t.tag ?? 'Verified Buyer'}
                  </span>
                </div>
              </div>

              {/* Author Info */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-border">
                <p className="font-display text-sm font-bold text-slate-900 dark:text-foreground">
                  {t.name}
                </p>
                <p className="font-sans text-xs text-slate-400 dark:text-muted-foreground mt-0.5">
                  {t.city} • {t.role ?? 'Customer'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


