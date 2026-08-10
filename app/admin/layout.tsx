'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { SITE } from '@/lib/site';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminLoggedIn, isLoading } = useAdminAuth();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAdminLoggedIn && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAdminLoggedIn, isLoading, isLoginPage, router]);

  // If on login page, render full screen login layout without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // White / Light theme Loading state during auth check matching the website
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F4F5F7] flex flex-col items-center justify-center p-6 text-slate-900 select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-primary/10 animate-ping" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg border border-slate-200">
            <img src={SITE.logo} alt="Fit Forever India" className="h-full w-full object-cover rounded-xl" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          Fit Forever Admin Console
        </div>
        <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
          Loading Fit Forever Admin...
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Syncing live inventory, Supabase database, and Cloudinary media assets.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Authenticating session</span>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] text-slate-900 flex">
      {/* Fixed Sticky Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        <AdminSidebar />
      </div>

      {/* Main Content View */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F4F5F7]">
          {children}
        </main>
      </div>
    </div>
  );
}
