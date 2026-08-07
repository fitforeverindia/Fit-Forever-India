'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { STATS } from '@/lib/data';

export function StatsSection() {
  return (
    <section className="bg-foreground py-20 text-white lg:py-28">
      <div className="container-fit">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Trusted Nationwide
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Numbers That Speak For Us
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className="text-center">
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-white/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString('en-IN')
  );

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  return (
    <span ref={ref} className="font-display text-4xl font-semibold lg:text-5xl">
      <motion.span>{display}</motion.span>
      <span className="text-primary">{suffix}</span>
    </span>
  );
}
