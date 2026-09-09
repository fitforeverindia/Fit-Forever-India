'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroSlidesStore } from '@/lib/hero-slides-store';

const DEFAULT_SLIDES = [
  {
    image: '/HeroBanner/slide1pc.png',
    imageMobile: '/HeroBanner/slide1mobile.png',
    eyebrow: 'Premium Fitness Equipment',
    title: 'Train. Recover. Live Better.',
    subtitle:
      'Manufacturer-direct wellness machines crafted for Indian homes and studios.',
    primary: { label: 'Shop Now', href: '/products' },
    secondary: { label: 'Explore Products', href: '/products' },
  },
  {
    image: '/HeroBanner/slide2pc.png',
    imageMobile: '/HeroBanner/slide2mobile.png',
    eyebrow: 'Spa-Grade Recovery',
    title: 'Massage Chairs That Restore',
    subtitle:
      'Zero-gravity recliners and targeted massagers for daily renewal.',
    primary: {
      label: 'Shop Massage Chairs',
      href: '/products?category=massage-chairs',
    },
    secondary: { label: 'Explore Products', href: '/products' },
  },
  {
    image: '/HeroBanner/slide3pc.png',
    imageMobile: '/HeroBanner/slide3mobile.png',
    eyebrow: 'Build Your Home Gym',
    title: 'Performance At Home',
    subtitle: 'Treadmills, spin bikes and strength systems built to last.',
    primary: { label: 'Shop Now', href: '/products' },
    secondary: { label: 'Explore Products', href: '/products' },
  },
];

export default function HeroSlider() {
  const { slides: dbSlides, loaded } = useHeroSlidesStore();

  const activeDbSlides = dbSlides
    .filter((s) => s.isActive !== false && (s.imageDesktop || s.imageMobile))
    .map((s) => ({
      image: s.imageDesktop || s.imageMobile || '',
      imageMobile: s.imageMobile || s.imageDesktop || '',
      eyebrow: s.eyebrow || '',
      title: s.title || '',
      subtitle: s.subtitle || '',
      primary: { label: s.primaryLabel || '', href: s.primaryHref || '/products' },
      secondary: { label: s.secondaryLabel || '', href: s.secondaryHref || '/products' },
    }));

  const SLIDES = activeDbSlides.length > 0 ? activeDbSlides : DEFAULT_SLIDES;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (index >= SLIDES.length) setIndex(0);
  }, [SLIDES.length, index]);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % SLIDES.length),
    [SLIDES.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    [SLIDES.length]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, paused]);

  // Show loading skeleton while fetching DB slides
  if (!loaded) {
    return (
      <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-[calc(100vh-4.5rem)] sm:min-h-[550px] lg:h-[calc(100vh-5rem)] bg-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setPaused(false);
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const currentSlide = SLIDES[index] || SLIDES[0];

  const hasEyebrow = Boolean(currentSlide?.eyebrow?.trim());
  const hasTitle = Boolean(currentSlide?.title?.trim());
  const hasSubtitle = Boolean(currentSlide?.subtitle?.trim());
  const hasPrimaryBtn = Boolean(currentSlide?.primary?.label?.trim());
  const hasSecondaryBtn = Boolean(currentSlide?.secondary?.label?.trim());
  const hasContent = hasEyebrow || hasTitle || hasSubtitle || hasPrimaryBtn || hasSecondaryBtn;

  return (
    <div className="relative w-full">
      <section
        className="
          relative w-full overflow-hidden bg-slate-950 select-none
          aspect-[4/5]
          sm:aspect-auto sm:h-[calc(100vh-4.5rem)] sm:min-h-[550px]
          lg:h-[calc(100vh-5rem)] lg:max-h-none
        "
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Stacked crossfading background images */}
        {SLIDES.map((slide, i) => {
          const slideHasEyebrow = Boolean(slide.eyebrow?.trim());
          const slideHasTitle = Boolean(slide.title?.trim());
          const slideHasSubtitle = Boolean(slide.subtitle?.trim());
          const slideHasPrimaryBtn = Boolean(slide.primary?.label?.trim());
          const slideHasSecondaryBtn = Boolean(slide.secondary?.label?.trim());
          const slideHasContent =
            slideHasEyebrow || slideHasTitle || slideHasSubtitle || slideHasPrimaryBtn || slideHasSecondaryBtn;

          const linkUrl = slide.primary?.href || slide.secondary?.href;

          const ImageComponent = (
            <picture className="h-full w-full block">
              <source media="(min-width: 640px)" srcSet={slide.image} />
              <img
                src={slide.imageMobile || slide.image}
                alt={slide.title || 'Hero Banner'}
                className="h-full w-full object-cover object-[65%_center] sm:object-center"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />
            </picture>
          );

          return (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: i === index ? 1 : 0,
                zIndex: i === index ? 1 : 0,
              }}
            >
              <div className="h-full w-full">
                {!slideHasContent && linkUrl ? (
                  <Link href={linkUrl} className="block h-full w-full cursor-pointer">
                    {ImageComponent}
                  </Link>
                ) : (
                  ImageComponent
                )}
              </div>

              {/* Dark overlay gradient only rendered if slide has overlay text */}
              {slideHasContent && (
                <>
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t from-black/75 via-black/40 to-black/15
                      sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-black/15
                      lg:from-black/75 lg:via-black/35 lg:to-transparent
                    "
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                </>
              )}
            </div>
          );
        })}

        {/* Hero content overlay (only rendered if text/buttons exist) */}
        {hasContent && (
          <div className="relative z-10 flex h-full items-center pt-8 pb-20 sm:py-0 pointer-events-none">
            <div className="container-fit w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-md sm:max-w-xl lg:max-w-2xl xl:max-w-3xl text-left pointer-events-auto"
                >
                  {hasEyebrow && (
                    <span
                      className="
                        inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15
                        px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]
                        text-white backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.25)]
                      "
                      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      {currentSlide.eyebrow}
                    </span>
                  )}

                  {hasTitle && (
                    <h1
                      className="
                        mt-3 sm:mt-4 font-display font-extrabold text-white text-balance
                        text-3xl leading-[1.15]
                        sm:text-5xl sm:leading-[1.1]
                        lg:text-6xl
                        xl:text-7xl
                      "
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                      {currentSlide.title}
                    </h1>
                  )}

                  {hasTitle && (
                    <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/0" />
                  )}

                  {hasSubtitle && (
                    <p
                      className="
                        mt-3 sm:mt-5 max-w-xl text-white/90 leading-relaxed
                        text-sm sm:text-base lg:text-lg xl:text-xl
                      "
                      style={{ textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}
                    >
                      {currentSlide.subtitle}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  {(hasPrimaryBtn || hasSecondaryBtn) && (
                    <div className="mt-5 sm:mt-8 flex flex-row items-center flex-wrap gap-3">
                      {hasPrimaryBtn && (
                        <Button
                          asChild
                          className="
                            group rounded-full bg-primary text-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.5)] shadow-primary/40
                            hover:bg-primary/90 hover:shadow-primary/60 hover:-translate-y-0.5
                            px-5 py-2.5 text-sm
                            sm:px-7 sm:py-6 sm:text-base
                            lg:px-8 lg:text-base
                            font-bold transition-all duration-300
                          "
                        >
                          <Link href={currentSlide.primary.href}>
                            {currentSlide.primary.label}
                            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                          </Link>
                        </Button>
                      )}

                      {hasSecondaryBtn && (
                        <Button
                          asChild
                          variant="outline"
                          className="
                            rounded-full border-white/40 bg-white/10 text-white backdrop-blur
                            hover:bg-white hover:text-slate-900 hover:-translate-y-0.5
                            px-5 py-2.5 text-sm
                            sm:px-7 sm:py-6 sm:text-base
                            lg:px-8 lg:text-base
                            font-bold transition-all duration-300
                          "
                        >
                          <Link href={currentSlide.secondary.href}>
                            {currentSlide.secondary.label}
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Desktop Controls (floating near bottom edge of section) */}
        <div className="hidden sm:flex absolute left-1/2 bottom-4 -translate-x-1/2 items-center gap-3 z-20">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/75 border border-white/20 h-10 w-10 lg:h-12 lg:w-12 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs border border-white/10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-8 lg:w-10 bg-primary shadow-[0_0_12px_rgba(0,0,0,0.4)] shadow-primary/70'
                    : 'w-2 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next slide"
            className="flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/75 border border-white/20 h-10 w-10 lg:h-12 lg:w-12 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </div>
      </section>

      {/* Mobile Controls Bar — rendered COMPLETELY OUTSIDE & BELOW the banner image section with clean WHITE background */}
      <div className="flex sm:hidden items-center justify-center gap-2.5 py-3 bg-white border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 h-8 w-8 shadow-xs dark:bg-slate-800 dark:text-white dark:border-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-white/10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 bg-primary shadow-xs'
                  : 'w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next slide"
          className="flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 h-8 w-8 shadow-xs dark:bg-slate-800 dark:text-white dark:border-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}