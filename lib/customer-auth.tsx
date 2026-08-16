'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type CustomerAuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signup: (name: string, email: string, passwordPlain: string) => Promise<boolean>;
  login: (email: string, passwordPlain: string) => Promise<boolean>;
  logout: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const SESSION_KEY = 'fitforever_customer_session';
const BACKUP_USERS_KEY = 'fitforever_backup_users';

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user session on start
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = async (name: string, email: string, passwordPlain: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: passwordPlain }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      const signedUser = data.user;
      setUser(signedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(signedUser));

      // Backup users on client side to survive server memory wipes/restarts
      try {
        const backups = JSON.parse(localStorage.getItem(BACKUP_USERS_KEY) || '[]');
        if (!backups.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          backups.push({ name, email: email.toLowerCase(), password: passwordPlain });
          localStorage.setItem(BACKUP_USERS_KEY, JSON.stringify(backups));
        }
      } catch (e) {
        console.error('Backup write failed', e);
      }

      toast.success(`Welcome to FitForever, ${signedUser.name}!`);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete registration.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, passwordPlain: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordPlain }),
      });

      const data = await res.json();

      // If server doesn't find the user (perhaps because of server memory reset),
      // we check our client-side backups and auto-re-register if credentials match!
      if (!res.ok) {
        try {
          const backups = JSON.parse(localStorage.getItem(BACKUP_USERS_KEY) || '[]');
          const backupUser = backups.find(
            (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === passwordPlain
          );

          if (backupUser) {
            // Re-signup user on server dynamically to keep server and client synced
            const retryRes = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: backupUser.name,
                email: backupUser.email,
                password: backupUser.password,
              }),
            });
            const retryData = await retryRes.json();
            if (retryRes.ok) {
              const loggedUser = retryData.user;
              setUser(loggedUser);
              localStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser));
              toast.success(`Welcome back, ${loggedUser.name}!`);
              return true;
            }
          }
        } catch (e) {
          console.error('Backup login resolution failed', e);
        }

        throw new Error(data.error || 'Incorrect email or password.');
      }

      const loggedUser = data.user;
      setUser(loggedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser));
      toast.success(`Welcome back, ${loggedUser.name}!`);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Login failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
    toast.info('Logged out successfully.');
    router.push('/');
  };

  return (
    <CustomerAuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
}
