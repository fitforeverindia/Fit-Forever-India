import { Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/site';

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-8 text-center select-none">
      <div className="relative flex items-center justify-center">
        {/* Glowing pulse ring */}
        <div className="absolute h-20 w-20 rounded-full bg-primary/20 animate-ping" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-xl border border-slate-200">
          <img
            src={SITE.logo}
            alt="Fit Forever India"
            className="h-full w-full object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary border border-primary/20">
        <Sparkles className="h-3.5 w-3.5" />
        Fit Forever Admin Console
      </div>

      <h3 className="mt-3 font-display text-xl font-bold text-slate-900">
        Loading Store Database...
      </h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        Syncing live inventory, Supabase database, and Cloudinary media assets.
      </p>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Fetching live records</span>
      </div>
    </div>
  );
}
