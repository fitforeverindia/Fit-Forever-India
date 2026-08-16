'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useCategoriesStore } from '@/lib/categories-store';
import { SITE, NAV_LINKS, CATEGORIES } from '@/lib/site';

export default function Footer() {
  const pathname = usePathname();
  const { categories: dynamicCategories } = useCategoriesStore();
  const displayCategories =
    Array.isArray(dynamicCategories) && dynamicCategories.length > 0
      ? dynamicCategories
      : CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }));

  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup') return null;

  return (
    <footer className="bg-foreground text-white">
      <div className="container-fit grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src={SITE.logo}
              alt="Fit Forever India"
              className="h-11 w-11 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="font-display text-xl font-semibold leading-none">
              Fit Forever
              <span className="block text-[10px] font-normal uppercase tracking-[0.25em] opacity-60">
                India
              </span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-white/70">
            Manufacturer and retailer of premium fitness and wellness
            equipment. Bringing spa-grade recovery and performance training
            into homes across India.
          </p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <Instagram className="h-5 w-5" />
            @fitforeverindia888
          </a>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/90">
            Company
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/90">
            Products
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            {displayCategories.slice(0, 7).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="transition-colors hover:text-white"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/90">
            Contact
          </h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Head Office: {SITE.headOfficeCity}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="space-y-0.5">
                <a href={`tel:${SITE.phones[0]}`} className="block hover:text-white">
                  {SITE.phones[0]}
                </a>
                <a href={`tel:${SITE.phones[1]}`} className="block hover:text-white">
                  {SITE.phones[1]}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={`mailto:${SITE.email}`}
                className="break-all hover:text-white"
              >
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-fit flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Fit Forever India. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
