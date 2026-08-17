'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Builds a compact page list like: 1 … 4 5 6 … 12, so it never overflows small screens.
function getPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  let prev = 0;
  for (const page of sorted) {
    if (prev && page - prev > 1) result.push('ellipsis');
    result.push(page);
    prev = page;
  }
  return result;
}

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const pageList = getPageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1.5 py-8 sm:gap-2', className)}
    >
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-9 w-9 shrink-0 rounded-full border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 sm:h-10 sm:w-10"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>

      <div className="flex items-center gap-1 sm:gap-1.5">
        {pageList.map((page, i) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-6 items-center justify-center text-sm font-semibold text-slate-400 sm:h-10 sm:w-8"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 sm:h-10 sm:w-10 sm:text-sm',
                page === currentPage
                  ? 'bg-[#1E1E1E] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-9 w-9 shrink-0 rounded-full border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 sm:h-10 sm:w-10"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </nav>
  );
}
