'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  MapPin,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Store,
} from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Showrooms / Outlets', href: '/admin/outlets', icon: MapPin },
];


export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { logout, adminUser } = useAdminAuth();

  return (
    <aside
      className={cn(
        'flex h-full max-h-screen w-64 flex-col justify-between border-r border-slate-200/80 bg-[#F8FAFC] text-slate-900 p-4 shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Top Header & Logo (Fixed) */}
      <div className="shrink-0 flex items-center gap-3 px-3 py-3 border-b border-slate-200/80 pb-4">
        <img
          src={SITE.logo}
          alt="Fit Forever India"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/50"
        />
        <div>
          <h2 className="font-display font-bold text-base leading-none text-slate-900">
            Fit Forever
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Middle Navigation Items (Scrollable when needed) */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Main Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn('h-4 w-4', isActive ? 'text-primary-foreground' : 'text-slate-500 group-hover:text-primary')} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-80" />}
            </Link>
          );
        })}
      </div>

      {/* Bottom Footer & Admin Profile (Fixed) */}
      <div className="shrink-0 space-y-3 pt-3 border-t border-slate-200/80">
        {/* View Live Storefront button */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-100 hover:text-slate-900"
        >
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-emerald-600" />
            <span>View Live Store</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        {/* Admin Profile Badge */}
        <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
              FF
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {adminUser?.email || 'admin@fitforever.in'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}



