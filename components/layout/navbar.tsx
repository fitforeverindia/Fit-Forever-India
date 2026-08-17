'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Heart,
  Home,
  Image as ImageIcon,
  Info,
  MapPin,
  Menu,
  Package,
  Phone,
  ShoppingBag,
  User,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useStore } from '@/components/store/store-provider';
import { useCategoriesStore } from '@/lib/categories-store';
import { useCustomerAuth } from '@/lib/customer-auth';
import { SITE, NAV_LINKS, CATEGORIES, CATEGORY_IMAGES } from '@/lib/site';
import { cn } from '@/lib/utils';


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsHovered, setProductsHovered] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { cartCount, wishlist, setCartOpen, setWishlistOpen } = useStore();
  const { user: customerUser, logout: customerLogout } = useCustomerAuth();


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

  const NAV_ICONS: Record<string, typeof Home> = {
    '/': Home,
    '/products': Package,
    '/gallery': ImageIcon,
    '/about': Info,
    '/outlets': MapPin,
    '/contact': Phone,
  };

  const isAdminRoute = pathname?.startsWith('/admin');
  const isHome = pathname === '/';
  const overHero = false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  if (isAdminRoute || isAuthRoute) return null;



  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          overHero
            ? 'bg-transparent'
            : 'glass-nav border-b border-border bg-white/95 backdrop-blur-md dark:bg-card/95',
          scrolled ? 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]' : 'shadow-soft'
        )}
      >
        <nav className="container-fit flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <img
              src={SITE.logo}
              alt="Fit Forever India"
              className="h-12 w-12 rounded-full object-cover ring-1 ring-border transition-transform duration-300 group-hover:scale-105 group-hover:ring-primary/40 lg:h-16 lg:w-16"
            />
            <span className="flex flex-col justify-center leading-tight">
              <span className="font-sans text-base font-bold tracking-tight text-foreground lg:text-lg">
                Fit Forever
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
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
                        'relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-base font-semibold transition-all duration-300 whitespace-nowrap hover:bg-primary/5',
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
                            'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]',
                            overHero ? 'bg-white' : 'bg-primary shadow-primary/60'
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
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[680px] z-50"
                        >
                          <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:bg-card dark:border-border">
                            <div className="flex items-center justify-between bg-gradient-to-r from-primary/5 via-transparent to-transparent px-6 py-4 border-b border-slate-100 dark:border-border">
                              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                All Categories ({displayCategories.length})
                              </span>
                              <Link
                                href="/products"
                                onClick={() => setProductsHovered(false)}
                                className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-primary transition-colors dark:text-foreground"
                              >
                                View All Products
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-2 p-4">
                              {displayCategories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/products?category=${cat.slug}`}
                                  onClick={() => setProductsHovered(false)}
                                  className="group flex items-center gap-3 rounded-2xl p-2.5 transition-all duration-300 hover:bg-primary/5"
                                >
                                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-50 p-1.5 ring-1 ring-slate-100 transition-all duration-300 group-hover:ring-primary/40 group-hover:shadow-md dark:bg-muted dark:ring-border">
                                    <img
                                      src={cat.image || CATEGORY_IMAGES[cat.slug] || ''}
                                      alt={cat.name}
                                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-sans text-xs font-bold text-slate-900 group-hover:text-primary transition-colors dark:text-foreground">
                                      {cat.name}
                                    </h4>
                                    <p className="mt-0.5 text-[10px] text-slate-400 line-clamp-1 dark:text-muted-foreground">
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
                      'relative rounded-full px-4 py-2 text-base font-semibold transition-all duration-300 whitespace-nowrap hover:bg-primary/5',
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
                          'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]',
                          overHero ? 'bg-white' : 'bg-primary shadow-primary/60'
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
                'relative rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10',
                overHero && 'text-white hover:bg-white/10 hover:text-white'
              )}
              onClick={() => {
                if (!customerUser) {
                  toast.error('Please log in or sign up to access your wishlist.');
                  router.push('/login');
                } else {
                  setWishlistOpen(true);
                }
              }}
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                  {wishlist.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className={cn(
                'relative rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10',
                overHero && 'text-white hover:bg-white/10 hover:text-white'
              )}
              onClick={() => {
                if (!customerUser) {
                  toast.error('Please log in or sign up to access your cart.');
                  router.push('/login');
                } else {
                  setCartOpen(true);
                }
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-[0_0_8px_rgba(0,0,0,0.3)] shadow-primary/60">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Customer Authentication */}
            {!customerUser ? (
              <Button
                asChild
                variant="ghost"
                size="icon"
                aria-label="Account"
                className={cn(
                  'rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10',
                  overHero && 'text-white hover:bg-white/10 hover:text-white'
                )}
              >
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 p-1"
                >
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary font-display text-xs sm:text-sm font-bold text-white shadow-md shadow-primary/30 ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:shadow-primary/50">
                    {customerUser.name ? customerUser.name.trim().charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span
                    className={cn(
                      'hidden md:inline-flex items-center gap-1 text-sm font-semibold',
                      overHero ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {customerUser.name.split(' ')[0]}
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Invisible backdrop to dismiss dropdown */}
                      <div className="fixed inset-0 z-40 cursor-default" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:bg-card dark:border-border z-50 text-slate-800 dark:text-foreground text-left"
                      >
                        <div className="px-3 py-2 border-b border-slate-50 dark:border-border mb-1.5">
                          <p className="text-xs font-bold truncate">{customerUser.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-muted-foreground truncate">{customerUser.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors"
                        >
                          My Account
                        </Link>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            customerLogout();
                          }}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                        >
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Button
              asChild
              size="sm"
              className="hidden rounded-full bg-primary font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 sm:inline-flex"
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
                'lg:hidden rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10',
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
          <div>
            <div className="flex h-16 items-center justify-between border-b bg-gradient-to-r from-primary/5 via-transparent to-transparent px-5">
              <span className="inline-flex items-center gap-2 font-sans text-lg font-bold">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Menu
              </span>
            </div>

            {customerUser && (
              <div className="flex items-center gap-3 px-5 py-4 border-b bg-slate-50/50 dark:bg-muted/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white shadow-md shadow-primary/30 ring-1 ring-white/10">
                  {customerUser.name ? customerUser.name.trim().charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-foreground truncate">{customerUser.name}</p>
                  <p className="text-xs text-slate-400 dark:text-muted-foreground truncate">{customerUser.email}</p>
                </div>
              </div>
            )}

            <ul className="flex flex-col p-3 overflow-y-auto space-y-1">
              {NAV_LINKS.map((link) => {
                const LinkIcon = NAV_ICONS[link.href] ?? Package;
                const linkActive = pathname === link.href;

                if (link.href === '/products') {
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-primary/5',
                          mobileProductsOpen && 'bg-primary/5 text-primary'
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <LinkIcon className="h-4 w-4 text-primary" />
                          {link.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-300',
                            mobileProductsOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {mobileProductsOpen && (
                        <div className="my-1 space-y-1 rounded-2xl bg-slate-50 p-2 dark:bg-muted/30">
                          <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10"
                          >
                            All Products
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {displayCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-primary dark:text-muted-foreground dark:hover:bg-card"
                            >
                              <span className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 dark:border-border dark:bg-card">
                                <img
                                  src={cat.image || CATEGORY_IMAGES[cat.slug] || ''}
                                  alt={cat.name}
                                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                              </span>
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
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-primary/5',
                        linkActive && 'bg-primary/10 text-primary'
                      )}
                    >
                      <LinkIcon className={cn('h-4 w-4', linkActive ? 'text-primary' : 'text-slate-400')} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              {customerUser ? (
                <>
                  <li className="border-t my-2 pt-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:bg-primary/5"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      My Account
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        customerLogout();
                      }}
                      className="flex w-full items-center rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/10 text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : null}
            </ul>
          </div>

          <div className="border-t p-4 mt-auto space-y-2">
            {!customerUser && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Button asChild variant="outline" className="w-full rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full rounded-full bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40">
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
            <Button asChild className="w-full rounded-full bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40">
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

