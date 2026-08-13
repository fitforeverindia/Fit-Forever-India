'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Heart, Menu, Phone, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/components/store/store-provider';
import { useCategoriesStore } from '@/lib/categories-store';
import { SITE, NAV_LINKS, CATEGORIES, CATEGORY_IMAGES } from '@/lib/site';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsHovered, setProductsHovered] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const { cartCount, wishlist, setCartOpen, setWishlistOpen } = useStore();

  const { categories: dynamicCategories } = useCategoriesStore();
  const displayCategories =
    Array.isArray(dynamicCategories) && dynamicCategories.length > 0
      ? dynamicCategories
      : CATEGORIES.map((c) => ({
          id: c.slug,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: CATEGORY_IMAGES[c.slug] || '',
        }));

  const isAdminRoute = pathname?.startsWith('/admin');
  const isHome = pathname === '/';
  const overHero = isHome && !scrolled && !productsHovered;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isAdminRoute) return null;


  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          overHero
            ? 'bg-transparent'
            : 'glass-nav border-b border-border shadow-soft bg-white/95 dark:bg-card/95 backdrop-blur-md'
        )}
      >
        <nav className="container-fit flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src={SITE.logo}
              alt="Fit Forever India"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-border lg:h-11 lg:w-11"
            />
            <span
              className={cn(
                'font-sans text-lg font-bold leading-none tracking-tight lg:text-xl',
                overHero ? 'text-white' : 'text-foreground'
              )}
            >
              Fit Forever
              <span className="block text-[10px] font-normal uppercase tracking-[0.25em] opacity-70">
                India
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              const isProducts = link.href === '/products';

              if (isProducts) {
                return (
                  <li
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setProductsHovered(true)}
                    onMouseLeave={() => setProductsHovered(false)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                        overHero
                          ? 'text-white/90 hover:text-white'
                          : 'text-foreground/70 hover:text-foreground',
                        active && (overHero ? 'text-white' : 'text-foreground')
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-300',
                          productsHovered && 'rotate-180'
                        )}
                      />
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className={cn(
                            'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full',
                            overHero ? 'bg-white' : 'bg-primary'
                          )}
                        />
                      )}
                    </Link>

                    {/* Mega Dropdown Menu for Categories */}
                    <AnimatePresence>
                      {productsHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[640px] z-50"
                        >
                          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-2xl dark:bg-card dark:border-border">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-border">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                All Categories ({displayCategories.length})
                              </span>
                              <Link
                                href="/products"
                                onClick={() => setProductsHovered(false)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-primary transition-colors dark:text-foreground"
                              >
                                View All Products
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              {displayCategories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/products?category=${cat.slug}`}
                                  onClick={() => setProductsHovered(false)}
                                  className="group flex items-center gap-3 rounded-2xl p-2.5 transition-all hover:bg-slate-50 dark:hover:bg-muted/50"
                                >
                                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-muted p-1">
                                    <img
                                      src={cat.image || CATEGORY_IMAGES[cat.slug] || ''}
                                      alt={cat.name}
                                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-sans text-xs font-bold text-slate-900 group-hover:text-primary transition-colors dark:text-foreground">
                                      {cat.name}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 line-clamp-1 dark:text-muted-foreground">
                                      {cat.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                      overHero
                        ? 'text-white/90 hover:text-white'
                        : 'text-foreground/70 hover:text-foreground',
                      active && (overHero ? 'text-white' : 'text-foreground')
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className={cn(
                          'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full',
                          overHero ? 'bg-white' : 'bg-primary'
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              className={cn(
                'relative rounded-full',
                overHero && 'text-white hover:bg-white/10 hover:text-white'
              )}
              onClick={() => setWishlistOpen(true)}
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className={cn(
                'relative rounded-full',
                overHero && 'text-white hover:bg-white/10 hover:text-white'
              )}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              asChild
              size="sm"
              className="hidden rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex"
            >
              <a href={`tel:${SITE.headOfficePhone}`}>
                <Phone className="mr-1.5 h-4 w-4" />
                Call Now
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              className={cn(
                'lg:hidden rounded-full',
                overHero && 'text-white hover:bg-white/10 hover:text-white'
              )}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full max-w-xs p-0 flex flex-col justify-between">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center justify-between border-b px-5">
            <span className="font-sans text-lg font-bold">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ul className="flex flex-col p-3 overflow-y-auto space-y-1">
            {NAV_LINKS.map((link) => {
              if (link.href === '/products') {
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-muted"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          mobileProductsOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {mobileProductsOpen && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50 dark:bg-muted/30 rounded-xl my-1">
                        <Link
                          href="/products"
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2 text-xs font-bold text-primary"
                        >
                          All Products →
                        </Link>
                        {displayCategories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:text-primary dark:text-muted-foreground"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-muted',
                      pathname === link.href && 'bg-slate-100 text-primary dark:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t p-4 mt-auto">
            <Button asChild className="w-full rounded-full bg-primary text-primary-foreground font-semibold">
              <a href={`tel:${SITE.headOfficePhone}`}>
                <Phone className="mr-2 h-4 w-4" />
                {SITE.headOfficePhone}
              </a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

