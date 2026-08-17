'use client';

import {
  BadgeCheck, Factory, Headset, ShieldCheck, Users, Wallet,
} from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { WHY_CHOOSE } from '@/lib/data';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory,
  BadgeCheck,
  ShieldCheck,
  Headset,
  Wallet,
  Users,
};

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12">
      {/* Soft ambient glow backdrop */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-fit">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Why Us
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why Choose Fit Forever India
          </h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
          <p className="mt-4 text-muted-foreground">
            We manufacture, deliver and service premium equipment with a
            relentless focus on quality and trust.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item, i) => {
            const Icon = ICONS[item.icon] ?? BadgeCheck;
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.2)]">
                  {/* Corner accent glow on hover */}
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative mt-5 font-display text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
