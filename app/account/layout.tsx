'use client';

import { useCustomerAuth } from '@/lib/customer-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoader } from '@/components/ui/page-loader';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-slate-50/50">
        <PageLoader message="Loading your account dashboard..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-slate-50/50">
        <PageLoader />
      </div>
    );
  }

  const navItems = [
    {
      label: 'Overview',
      href: '/account',
      icon: LayoutDashboard,
    },
    {
      label: 'My Orders',
      href: '/account/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Account Settings',
      href: '/account/settings',
      icon: Settings,
    },
  ];

  // Helper to determine active route
  const isItemActive = (href: string) => {
    if (href === '/account') {
      return pathname === '/account';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8F9FB] pt-24 pb-16">
      <div className="container-fit">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/account" className="hover:text-primary transition-colors">Account</Link>
          {pathname !== '/account' && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary capitalize font-bold">
                {pathname.includes('/settings') 
                  ? 'Settings' 
                  : pathname.includes('/orders/') 
                    ? 'Order Details' 
                    : 'Orders'}
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-4">
            {/* User Profile Card */}
            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white shadow-sm ring-2 ring-primary/10">
                  {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-bold text-slate-900 truncate">{user.name}</h3>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation links (Desktop sidebar) */}
            <nav className="hidden lg:flex flex-col gap-1.5 rounded-2xl border border-slate-200/60 bg-white p-3.5 shadow-sm">
              {navItems.map((item) => {
                const isActive = isItemActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all duration-200',
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/15'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Compact navigation for Mobile/Tablet */}
            <nav className="flex lg:hidden overflow-x-auto gap-2 pb-1.5 hide-scrollbar">
              {navItems.map((item) => {
                const isActive = isItemActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all whitespace-nowrap border shrink-0',
                      isActive
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                        : 'bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
