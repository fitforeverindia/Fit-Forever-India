'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCustomerAuth } from '@/lib/customer-auth';
import { SITE } from '@/lib/site';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useCustomerAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validate()) return;

    setLocalLoading(true);
    const success = await login(email.trim(), password);
    setLocalLoading(false);

    if (success) {
      router.push('/');
    }
  };

  const isLoading = authLoading || localLoading;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#F4F5F7] flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      {/* Subtle soft background accents */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl sm:p-10">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src={SITE.logo}
                alt="Fit Forever India"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 shadow-sm"
              />
              <div className="text-left">
                <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
                  Fit Forever
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
                  India
                </span>
              </div>
            </Link>

            <h1 className="mt-6 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              Log in to your account to continue shopping premium fitness equipment.
            </p>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive border border-destructive/20 text-center">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  disabled={isLoading}
                  className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 text-xs rounded-xl focus:bg-white focus:border-primary focus:ring-primary disabled:opacity-60"
                />
              </div>
              {validationErrors.email && (
                <p className="text-[11px] font-medium text-destructive mt-1 ml-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  disabled={isLoading}
                  className="bg-slate-50 border-slate-200 text-slate-900 pl-10 pr-10 h-11 text-xs rounded-xl focus:bg-white focus:border-primary focus:ring-primary disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 disabled:opacity-40"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-[11px] font-medium text-destructive mt-1 ml-1">{validationErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-all mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Login</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer Navigation Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
