import { SITE } from '@/lib/site';

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message, className = '' }: PageLoaderProps) {
  return (
    <div className={`flex min-h-[50vh] w-full flex-col items-center justify-center p-8 text-center select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full bg-primary/20 animate-ping" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-xl border border-slate-200">
          <img
            src={SITE.logo}
            alt={SITE.name}
            className="h-full w-full object-cover rounded-xl"
          />
        </div>
      </div>
      {message && (
        <p className="mt-4 text-sm font-semibold text-slate-500">{message}</p>
      )}
    </div>
  );
}
