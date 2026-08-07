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

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-2 py-8', className)}
    >
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-10 w-10 rounded-full border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-[#1E1E1E] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-10 w-10 rounded-full border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </nav>
  );
}
