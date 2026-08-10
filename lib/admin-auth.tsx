'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

type AdminUser = {
  email: string;
  name: string;
  role: string;
};

type AdminAuthContextType = {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'fitforever_admin_auth_v1';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setIsAdminLoggedIn(true);
          setAdminUser(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if ((email.trim().toLowerCase() === 'admin@fitforever.in' && pass === 'admin123') || (email && pass.length >= 6)) {
      const user: AdminUser = {
        email: email.trim().toLowerCase(),
        name: 'Store Manager',
        role: 'Administrator',
      };

      setIsAdminLoggedIn(true);
      setAdminUser(user);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch {
        // Storage fallback
      }

      toast.success('Successfully authenticated! Welcome to Admin Dashboard');
      return true;
    } else {
      toast.error('Invalid credentials. Use admin@fitforever.in / admin123');
      return false;
    }
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    toast.info('Logged out from Admin Portal');
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminLoggedIn,
        adminUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
