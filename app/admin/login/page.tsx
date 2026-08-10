'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/lib/admin-auth';
import { SITE } from '@/lib/site';

export default function AdminLoginPage() {
  const { login, isAdminLoggedIn } = useAdminAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) {
      router.replace('/admin');
    }
  }, [isAdminLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.push('/admin');
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@fitforever.in');
    setPassword('admin123');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card Container */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src={SITE.logo}
                alt="Fit Forever India"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/40"
              />
              <div className="text-left">
                <span className="font-display text-xl font-bold text-white tracking-tight">
                  Fit Forever
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
                  Admin Portal
                </span>
              </div>
            </Link>

            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Fit Forever Console
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-xs text-slate-400">
              Sign in with your administrator account to manage store catalog, customers, and Cloudinary media.
            </p>
          </div>

          {/* Quick Demo Credentials Fill Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleDemoFill}
              className="flex w-full items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 text-xs font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                <span>Fill Demo Admin Credentials</span>
              </div>
              <span className="font-mono text-[10px] font-bold underline">Click</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-300">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  placeholder="admin@fitforever.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/80 border-slate-700 text-white pl-10 h-11 text-xs rounded-xl focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/80 border-slate-700 text-white pl-10 pr-10 h-11 text-xs rounded-xl focus:border-primary focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all mt-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In To Admin Console</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Main Fit Forever Store
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
