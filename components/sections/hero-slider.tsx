'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    image: 'https://images.pexels.com/photos/35215412/pexels-photo-35215412.jpeg?auto=compress&cs=tinysrgb&w=1920',
    eyebrow: 'Premium Fitness Equipment',
    title: 'Train. Recover. Live Better.',
    subtitle: 'Manufacturer-direct wellness machines crafted for Indian homes and studios.',
    primary: { label: 'Shop Now', href: '/products' },
    secondary: { label: 'Explore Products', href: '/products' },
  },
  {
    image: 'https://res.cloudinary.com/ufptbplr/image/upload/v1786000626/massagechairhero_nkpobu.jpg',
    eyebrow: 'Spa-Grade Recovery',
    title: 'Massage Chairs That Restore',
    subtitle: 'Zero-gravity recliners and targeted massagers for daily renewal.',
    primary: { label: 'Shop Massage Chairs', href: '/products?category=massage-chairs' },
    secondary: { label: 'Explore Products', href: '/products' },
  },
  {
    image: 'https://images.pexels.com/photos/7174396/pexels-photo-7174396.jpeg?auto=compress&cs=tinysrgb&w=1920',
    eyebrow: 'Build Your Home Gym',
    title: 'Performance At Home',
    subtitle: 'Treadmills, spin bikes and strength systems built to last.',
    primary: { label: 'Shop Now', href: '/products' },
    secondary: { label: 'Explore Products', href: '/products' },
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

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
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-foreground select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stacked crossfading images — no white flash between slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-center">
        <div className="container-fit">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="max-w-2xl"
            >
              <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                {SLIDES[index].eyebrow}
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-white text-balance sm:text-5xl lg:text-6xl">
                {SLIDES[index].title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {SLIDES[index].subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={SLIDES[index].primary.href}>
                    {SLIDES[index].primary.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-foreground"
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

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-primary' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

