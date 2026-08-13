'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { ProductCard } from '@/components/store/product-card';
import { useProductsStore } from '@/lib/products-store';
import type { Product } from '@/lib/types';

export function FeaturedProducts({ products: initialProducts }: { products?: Product[] }) {
  const { products: dynamicProducts } = useProductsStore();

  // Combine initial server products and client dynamic store products
  const allProducts = initialProducts && initialProducts.length > 0 ? initialProducts : dynamicProducts;

  // Filter ONLY products explicitly marked as featured by admin in database
  const featuredList = allProducts.filter((p) => Boolean(p.featured));
  const items = featuredList.slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className="bg-secondary/50 py-8 sm:py-12">
      <div className="container-fit">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Popular Picks
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-2 text-xs sm:text-base max-w-lg text-muted-foreground">
              Loved by thousands of customers across India.
            </p>
          </Reveal>
          <Reveal direction="right">
            <Button asChild variant="outline" size="sm" className="border-foreground/20 text-xs font-bold">
              <Link href="/products">
                View All
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* 2 Products per row on Mobile (grid-cols-2) */}
        <div className="mt-6 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {items.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
