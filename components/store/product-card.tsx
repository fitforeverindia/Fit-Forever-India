'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, Star } from 'lucide-react';
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

  return (
    <>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-slate-100 bg-white p-3.5 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:shadow-2xl dark:bg-card dark:border-border"
      >
        {/* Top Image Container - Full Fit */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-secondary">
          <Link href={`/products/${product.slug}`}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
          </Link>

          {/* Top-Right Heart Wishlist Button */}
          <button
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
              toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist');
            }}
            className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md backdrop-blur transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
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
            className="absolute bottom-3.5 right-3.5 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 hover:text-black group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col justify-between pt-4 px-1">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-sans text-xl font-bold tracking-tight text-slate-900 line-clamp-1 transition-colors group-hover:text-primary dark:text-foreground">
                {product.name}
              </h3>
            </Link>
            <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-2 dark:text-muted-foreground">
              {product.shortDescription ?? 'Lightweight, durable, and built for peak performance every step of the way.'}
            </p>
          </div>

          {/* Bottom Bar: Price & Add To Cart Button */}
          <div className="mt-5 flex items-center justify-between gap-3 pt-1">
            <div className="flex flex-col">
              <span className="font-sans text-lg sm:text-xl font-extrabold text-slate-900 dark:text-foreground">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="rounded-full bg-[#1E1E1E] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 shadow-sm hover:bg-black active:scale-95 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </motion.article>

      {quickView && <QuickView product={product} onClose={() => setQuickView(false)} />}
    </>
  );
}

function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useStore();
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="grid max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[32px] bg-card shadow-2xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square bg-[#F8F8F9] p-6 flex items-center justify-center dark:bg-secondary">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
          {discount > 0 && (
            <Badge className="absolute left-4 top-4 border-0 bg-[#22C55E] px-3 py-1 text-xs font-semibold text-white">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="flex flex-col overflow-y-auto p-6 justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.categoryName}
            </p>
            <h2 className="mt-1 font-sans text-2xl font-bold">{product.name}</h2>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-border'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description ?? product.shortDescription}
            </p>
          </div>

          <div>
            <div className="mt-5 flex items-end gap-3">
              <span className="font-sans text-2xl font-bold">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="pb-1 text-sm text-muted-foreground line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-full bg-[#1E1E1E] py-3 text-sm font-semibold text-white transition-all hover:bg-black active:scale-95"
                onClick={() => {
                  addToCart(product);
                  toast.success(`${product.name} added to cart`);
                  onClose();
                }}
              >
                Add To Cart
              </button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/products/${product.slug}`}>Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

