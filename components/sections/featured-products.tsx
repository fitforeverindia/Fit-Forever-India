'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/lib/types';

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-secondary/50 py-8 sm:py-12">
      <div className="container-fit">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Popular Picks
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Loved by thousands of customers across India.
            </p>
          </Reveal>
          <Reveal direction="right">
            <Button asChild variant="outline" className="border-foreground/20">
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
