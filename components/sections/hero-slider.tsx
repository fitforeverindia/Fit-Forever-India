'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    image:
      'https://images.pexels.com/photos/35215412/pexels-photo-35215412.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile:
      'https://images.pexels.com/photos/35215412/pexels-photo-35215412.jpeg?auto=compress&cs=tinysrgb&w=800',
    eyebrow: 'Premium Fitness Equipment',
    title: 'Train. Recover. Live Better.',
    subtitle:
      'Manufacturer-direct wellness machines crafted for Indian homes and studios.',
    primary: { label: 'Shop Now', href: '/products' },
    secondary: { label: 'Explore Products', href: '/products' },
  },
  {
    image:
      'https://res.cloudinary.com/ufptbplr/image/upload/v1786000626/massagechairhero_nkpobu.jpg',
    imageMobile:
      'https://res.cloudinary.com/ufptbplr/image/upload/v1786000626/massagechairhero_nkpobu.jpg',
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
    image:
      'https://images.pexels.com/photos/7174396/pexels-photo-7174396.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile:
      'https://images.pexels.com/photos/7174396/pexels-photo-7174396.jpeg?auto=compress&cs=tinysrgb&w=800',
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

  const next = useCallback(
    () => setIndex((i) => (i + 1) % SLIDES.length),
    []
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    []
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
        h-[100svh] min-h-[560px] max-h-[1080px]
        sm:h-[92vh] sm:min-h-[600px]
        lg:h-screen lg:max-h-none
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
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: i === index ? 1 : 0,
            zIndex: i === index ? 1 : 0,
          }}
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

          {/* Dual overlay gradient for readability on all devices */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t from-black/90 via-black/55 to-black/40
              sm:bg-gradient-to-r sm:from-black/90 sm:via-black/55 sm:to-black/20
              lg:from-black/85 lg:via-black/40 lg:to-transparent
            "
          />
        </div>
      ))}

      {/* Hero content */}
      <div className="relative z-10 flex h-full items-center pt-24 pb-20 sm:py-0">
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
                  inline-block rounded-full border border-white/20 bg-white/15
                  px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]
                  text-white backdrop-blur
                "
              >
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
              >
                {SLIDES[index].title}
              </h1>

              <p
                className="
                  mt-3 sm:mt-5 max-w-xl text-white/90 leading-relaxed
                  text-sm sm:text-base lg:text-lg xl:text-xl
                "
              >
                {SLIDES[index].subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="mt-5 sm:mt-8 flex flex-row items-center flex-wrap gap-3">
                <Button
                  asChild
                  className="
                    rounded-full bg-primary text-white shadow-lg shadow-primary/25
                    hover:bg-primary/90
                    px-5 py-2.5 text-sm
                    sm:px-7 sm:py-6 sm:text-base
                    lg:px-8 lg:text-base
                    font-bold
                  "
                >
                  <Link href={SLIDES[index].primary.href}>
                    {SLIDES[index].primary.label}
                    <ArrowRight className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="
                    rounded-full border-white/40 bg-white/10 text-white backdrop-blur
                    hover:bg-white hover:text-slate-900
                    px-5 py-2.5 text-sm
                    sm:px-7 sm:py-6 sm:text-base
                    lg:px-8 lg:text-base
                    font-bold
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
              className={`h-1.5 sm:h-2 rounded-full transition-all ${i === index
                ? 'w-6 sm:w-8 lg:w-10 bg-primary'
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