'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { SITE } from '@/lib/site';
import { GALLERY_ITEMS } from '@/lib/data';

export function InstagramGallery() {
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="container-fit">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            @fitforeverindia888
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            From Our Gallery
          </h2>
          <p className="mt-4 text-muted-foreground">
            A glimpse of our showrooms, equipment and the wellness life.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {GALLERY_ITEMS.slice(0, 10).map((item, i) => (
            <Reveal key={item.id} delay={i * 0.04}>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl bg-card"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                  <Instagram className="h-7 w-7 text-white" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-4 w-4" />
              Follow Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
