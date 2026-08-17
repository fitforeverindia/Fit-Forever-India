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
      title: s.title,
      subtitle: s.subtitle || '',
      primary: { label: s.primaryLabel || 'Shop Now', href: s.primaryHref || '/products' },
      secondary: { label: s.secondaryLabel || 'Explore Products', href: s.secondaryHref || '/products' },
    }));

  // Use admin-managed slides once loaded; fall back to the built-in defaults
  // only if the admin hasn't configured any slides yet.
  const SLIDES = loaded && activeDbSlides.length > 0 ? activeDbSlides : DEFAULT_SLIDES;

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

  return (
    <section
      className="
        relative w-full overflow-hidden bg-slate-950 select-none
        aspect-[4/5]
        sm:aspect-auto sm:h-[calc(100vh-4rem)] sm:min-h-[600px]
        lg:h-[calc(100vh-5rem)] lg:max-h-none
      "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stacked crossfading background images */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: i === index ? 1 : 0,
            zIndex: i === index ? 1 : 0,
          }}
        >
          <motion.div
            className="h-full w-full"
            animate={{ scale: i === index ? 1.08 : 1 }}
            transition={{ duration: 6.5, ease: 'linear' }}
          >
            <picture>
              <source media="(min-width: 640px)" srcSet={slide.image} />
              <img
                src={slide.imageMobile || slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-[65%_center] sm:object-center"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />
            </picture>
          </motion.div>

          {/* Dual overlay gradient for readability on all devices */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t from-black/70 via-black/35 to-black/15
              sm:bg-gradient-to-r sm:from-black/75 sm:via-black/40 sm:to-black/15
              lg:from-black/70 lg:via-black/30 lg:to-transparent
            "
          />

          {/* Bottom vignette for extra depth */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ))}

      {/* Hero content */}
      <div className="relative z-10 flex h-full items-center pt-8 pb-20 sm:py-0">
        <div className="container-fit w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md sm:max-w-xl lg:max-w-2xl xl:max-w-3xl text-left"
            >
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
                {SLIDES[index].eyebrow}
              </span>

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
                {SLIDES[index].title}
              </h1>

              <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary/0" />

              <p
                className="
                  mt-3 sm:mt-5 max-w-xl text-white/90 leading-relaxed
                  text-sm sm:text-base lg:text-lg xl:text-xl
                "
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}
              >
                {SLIDES[index].subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="mt-5 sm:mt-8 flex flex-row items-center flex-wrap gap-3">
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
                  <Link href={SLIDES[index].primary.href}>
                    {SLIDES[index].primary.label}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                  </Link>
                </Button>

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
                  <Link href={SLIDES[index].secondary.href}>
                    {SLIDES[index].secondary.label}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="
          absolute left-1/2 z-20 flex -translate-x-1/2 items-center
          gap-2 sm:gap-3
          bottom-4 sm:bottom-6 lg:bottom-10
        "
      >
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="
            flex items-center justify-center rounded-full bg-white/20 text-white
            backdrop-blur transition-colors hover:bg-white/40
            h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12
          "
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </button>

        <div className="flex gap-1.5 sm:gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${i === index
                ? 'w-6 sm:w-8 lg:w-10 bg-primary shadow-[0_0_12px_rgba(0,0,0,0.4)] shadow-primary/70'
                : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/70'
                }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next slide"
          className="
            flex items-center justify-center rounded-full bg-white/20 text-white
            backdrop-blur transition-colors hover:bg-white/40
            h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12
          "
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </button>
      </div>
    </section>
  );
}