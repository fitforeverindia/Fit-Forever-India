'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

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

  // Loading state during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Loading Fit Forever Admin...
        </p>
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
