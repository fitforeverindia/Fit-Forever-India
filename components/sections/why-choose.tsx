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
    <section className="py-8 sm:py-12">
      <div className="container-fit">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Why Us
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Why Choose Fit Forever India
          </h2>
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
                <div className="group h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
