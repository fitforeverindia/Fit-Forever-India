'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu, LogOut, Shield, CircleDot } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminSidebar } from './admin-sidebar';
import { useAdminAuth } from '@/lib/admin-auth';

const PATH_NAMES: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/products': 'Product Management',
  '/admin/categories': 'Category Management',
  '/admin/orders': 'Order Fulfillment',
  '/admin/outlets': 'Showroom Outlets',
};

export function AdminHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { adminUser, logout } = useAdminAuth();

  const title = PATH_NAMES[pathname] || 'Admin Dashboard';

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:h-20 backdrop-blur-md text-slate-900 shadow-xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-bold text-slate-900 sm:text-xl">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <CircleDot className="h-2 w-2 fill-emerald-600 animate-pulse" />
              Live Store
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Fit Forever India E-Commerce Control Center
          </p>
        </div>
      </div>

      {/* Right: Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-64 lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search products, orders..."
            className="h-9 border-slate-200 bg-slate-100/80 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white rounded-xl"
          />
        </div>

        {/* Notifications Icon */}
        <button
          title="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* Admin Profile pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-semibold">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="font-bold text-slate-900">
            {adminUser?.name || 'Manager'}
          </span>
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#F8FAFC] border-r border-slate-200/80">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <AdminSidebar />
        </SheetContent>
      </Sheet>

    </header>


  );
}
