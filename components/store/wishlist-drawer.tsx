'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useStore } from '@/components/store/store-provider';
import { formatINR } from '@/lib/format';
import { SEED_PRODUCTS } from '@/lib/data';
import type { Product } from '@/lib/types';

export function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setWishlistOpen, toggleWishlist, addToCart } = useStore();

  const items: Product[] = wishlist
    .map((id) => SEED_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <Sheet open={isWishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetTitle className="sr-only">Wishlist</SheetTitle>
        <div className="flex items-center gap-2 border-b px-5 py-4">
          <Heart className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-semibold">
            Wishlist ({items.length})
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Heart className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No favourites yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap the heart on any product to save it here.
              </p>
            </div>
            <Button asChild className="bg-primary text-primary-foreground" onClick={() => setWishlistOpen(false)}>
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {items.map((product) => (
              <div key={product.id} className="flex gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={() => setWishlistOpen(false)}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
                >
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setWishlistOpen(false)}
                      className="text-sm font-medium leading-snug hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Heart className="h-4 w-4 fill-accent text-accent" />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {product.categoryName}
                  </span>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold">{formatINR(product.price)}</span>
                    <Button
                      size="sm"
                      className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        addToCart(product);
                        setWishlistOpen(false);
                      }}
                    >
                      <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
