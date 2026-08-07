'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useStore } from '@/components/store/store-provider';
import { formatINR } from '@/lib/format';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useStore();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold">
              Your Cart ({cartCount})
            </span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover equipment worth moving for.
              </p>
            </div>
            <Button asChild className="bg-primary text-primary-foreground" onClick={() => setCartOpen(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="text-sm font-medium leading-snug hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.product.categoryName}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-semibold">
                  {formatINR(cartTotal)}
                </span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout.
              </p>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setCartOpen(false);
                  toastCheckout();
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function toastCheckout() {
  import('sonner').then(({ toast }) => {
    toast.info('Checkout is coming soon. Call us to place your order.');
  });
}
