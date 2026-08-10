'use client';

import React from 'react';
import { Check } from 'lucide-react';

import { useCategoriesStore } from '@/lib/categories-store';
import { cn } from '@/lib/utils';

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

export const CATEGORY_TREE: CategoryNode[] = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'massage-chairs', name: 'Massage Chairs', slug: 'massage-chairs' },
  { id: 'leg-massager', name: 'Leg Massager', slug: 'leg-massager' },
  { id: 'foot-massager', name: 'Foot Massager', slug: 'foot-massager' },
  { id: 'handy-body-massager', name: 'Handy Body Massager', slug: 'handy-body-massager' },
  { id: 'health-mate', name: 'Health Mate', slug: 'health-mate' },
  { id: 'jogpad', name: 'JogPad', slug: 'jogpad' },
  { id: 'treadmill', name: 'Treadmill', slug: 'treadmill' },
  { id: 'spin-bike', name: 'Spin Bike', slug: 'spin-bike' },
  { id: 'home-gym', name: 'Home Gym', slug: 'home-gym' },
];

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (selectedSlugs: string[]) => void;
  className?: string;
}

export function CategoryFilter({

  selectedCategories,
  onChange,
  className,
}: CategoryFilterProps) {
  const { categories } = useCategoriesStore();

  const categoryTree = [
    { id: 'all', name: 'All Products', slug: 'all' },
    ...categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  ];

  const isAllSelected =
    selectedCategories.length === 0 || selectedCategories.includes('all');


  const handleToggle = (slug: string) => {
    if (slug === 'all') {
      onChange(['all']);
      return;
    }

    let updated: string[];
    if (selectedCategories.includes(slug)) {
      updated = selectedCategories.filter((s) => s !== slug && s !== 'all');
    } else {
      updated = [...selectedCategories.filter((s) => s !== 'all'), slug];
    }

    if (updated.length === 0) {
      updated = ['all'];
    }

    onChange(updated);
  };

  const renderCheckbox = (
    slug: string,
    label: string,
    isChild: boolean = false
  ) => {
    const checked = slug === 'all' ? isAllSelected : selectedCategories.includes(slug);

    return (
      <label
        key={slug}
        onClick={(e) => {
          e.preventDefault();
          handleToggle(slug);
        }}
        className={cn(
          'group flex cursor-pointer items-center gap-3 py-2 transition-colors select-none',
          isChild ? 'pl-7' : 'pl-0'
        )}
      >
        <div
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-all duration-200',
            checked
              ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-sm'
              : 'border-slate-300 bg-white group-hover:border-slate-900 dark:border-slate-700 dark:bg-slate-900'
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </div>

        <span
          className={cn(
            'font-sans text-sm transition-colors text-black dark:text-white',
            checked
              ? 'font-extrabold text-black dark:text-white'
              : isChild
              ? 'font-medium text-slate-700 group-hover:text-black dark:text-slate-300 dark:group-hover:text-white'
              : 'font-semibold text-slate-900 group-hover:text-black dark:text-white'
          )}
        >
          {label}
        </span>
      </label>
    );
  };

  return (
    <div
      className={cn(
        'rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950',
        className
      )}
    >
      <h2 className="mb-6 font-sans text-2xl font-extrabold tracking-tight text-black dark:text-white">
        Categories
      </h2>

      <div className="flex flex-col space-y-1">
        {categoryTree.map((node) => (
          <React.Fragment key={node.id}>
            {renderCheckbox(node.slug, node.name, false)}
          </React.Fragment>
        ))}
      </div>

    </div>
  );
}
