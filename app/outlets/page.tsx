'use client';

import { PageHeader } from '@/components/sections/page-header';
import { Reveal } from '@/components/ui/reveal';
import { OUTLETS } from '@/lib/data';
import { MapPin, Navigation, Phone } from 'lucide-react';

export default function OutletsPage() {
  return (
    <>
      <PageHeader
        title="Outlet & Service Points"
        subtitle="Visit our official showrooms and service centers across India for direct experience and support."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Outlets' }]}
      />

      <section className="py-16 sm:py-24">
        <div className="container-fit">
          {/* Outlets Grid - Direct Cards Display */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OUTLETS.map((outlet, i) => (
              <Reveal key={outlet.id} delay={i * 0.04}>
                <div className="group flex h-full flex-col justify-between rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card dark:border-border">
                  <div>
                    {/* City Badge & Mall Name */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {outlet.city}
                      </span>
                      <span className="text-xs font-medium text-slate-400 dark:text-muted-foreground">
                        {outlet.mall}
                      </span>
                    </div>

                    {/* Outlet Name */}
                    <h3 className="mt-4 font-sans text-xl font-bold text-slate-900 group-hover:text-primary transition-colors dark:text-foreground">
                      {outlet.name}
                    </h3>

                    {/* Address */}
                    <div className="mt-3 flex items-start gap-2.5 text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                      <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{outlet.address}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between gap-3 dark:border-border">
                    <a
                      href={`tel:${outlet.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 dark:bg-muted dark:text-foreground"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {outlet.phone}
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${outlet.name} ${outlet.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Directions
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
