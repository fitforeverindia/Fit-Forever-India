'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/components/store/store-provider';
import { formatINR, discountPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quickView, setQuickView] = useState(false);
  const wished = isInWishlist(product.id);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[32px] border border-slate-100 bg-white p-2.5 sm:p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)] dark:bg-card dark:border-border h-full"
      >
        {/* Top Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-[24px] bg-white border border-slate-100 p-2 dark:bg-slate-900 dark:border-slate-800">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Badge */}
          {product.badge && (
            <span className="absolute left-2 top-2 sm:left-3.5 sm:top-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] sm:text-xs font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] backdrop-blur">
              {product.badge}
            </span>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute left-2 bottom-2 sm:left-3.5 sm:bottom-3.5 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[9px] sm:text-xs font-bold text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {discount}% OFF
            </span>
          )}

          {/* Top-Right Heart Wishlist Button */}
          <button
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
              toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist');
            }}
            className="absolute right-2 top-2 sm:right-3.5 sm:top-3.5 z-10 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <Heart
              className={cn(
                'h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors',
                wished ? 'fill-red-500 text-red-500' : 'text-slate-400 fill-none hover:text-red-500'
              )}
            />
          </button>

          {/* Quick View Button on Hover */}
          <button
            aria-label="Quick view"
            onClick={(e) => {
              e.preventDefault();
              setQuickView(true);
            }}
            className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 translate-y-3 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 hover:text-black group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col justify-between pt-2.5 sm:pt-4 px-0.5">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-sans text-xs sm:text-base font-bold tracking-tight text-slate-900 line-clamp-1 transition-colors group-hover:text-primary dark:text-foreground">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="mt-1 flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-2.5 w-2.5 sm:h-3 sm:w-3',
                        i < Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200 dark:fill-muted dark:text-muted'
                      )}
                    />
                  ))}
                </div>
                {product.reviewCount > 0 && (
                  <span className="text-[9px] sm:text-[11px] text-slate-400 dark:text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}

            <p className="mt-1 font-sans text-[11px] sm:text-xs leading-tight sm:leading-relaxed text-slate-500 line-clamp-2 dark:text-muted-foreground">
              {product.shortDescription ?? 'Lightweight, durable, and built for peak performance every step of the way.'}
            </p>
          </div>

          {/* Bottom Bar: Price & Add To Cart Button */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-1">
            <div className="flex items-baseline gap-1.5 shrink-0 whitespace-nowrap">
              <span className="font-sans text-sm sm:text-lg font-extrabold text-slate-900 dark:text-foreground">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="group/btn w-full sm:w-auto shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1E1E1E] px-3.5 py-2 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-white transition-all duration-300 shadow-sm hover:bg-primary hover:shadow-lg hover:shadow-primary/25 active:scale-95 text-center dark:bg-slate-800 dark:hover:bg-primary"
            >
              <ShoppingCart className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:scale-110" />
              Add To Cart
            </button>
          </div>
        </div>
      </motion.article>

      {/* Quick View Dialog */}
      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-w-lg w-full rounded-3xl bg-white p-6 shadow-2xl dark:bg-card border border-slate-200 dark:border-border">
            <button
              onClick={() => setQuickView(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
            <div className="flex gap-4">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">{product.name}</h3>
                <p className="font-mono text-sm font-bold text-primary mt-1">{formatINR(product.price)}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3">{product.shortDescription}</p>
                <Button
                  onClick={() => {
                    addToCart(product);
                    setQuickView(false);
                    toast.success(`${product.name} added to cart`);
                  }}
                  size="sm"
                  className="mt-4 rounded-full bg-primary text-white font-bold"
                >
                  Add To Cart Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
