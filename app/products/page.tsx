'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Grid3X3, Grid2X2, RotateCcw } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import { CategoryFilter } from '@/components/store/category-filter';
import { PaginationControl } from '@/components/ui/pagination-control';
import { useProductsStore } from '@/lib/products-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';

const ITEMS_PER_PAGE = 6;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category');

  const { products } = useProductsStore();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    return initialCategory ? [initialCategory] : ['all'];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [gridCols, setGridCols] = useState<'3' | '2'>('3');

  // Update categories if URL parameter changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    } else {
      setSelectedCategories(['all']);
    }
  }, [initialCategory]);

  // Reset page to 1 when filters change and sync URL
  const handleCategoryChange = (slugs: string[]) => {
    setSelectedCategories(slugs);
    setCurrentPage(1);
    const firstActive = slugs.find((s) => s !== 'all');
    if (firstActive) {
      router.push(`/products?category=${firstActive}`, { scroll: false });
    } else {
      router.push('/products', { scroll: false });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Filter products based on selected categories and search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchCategory = product.categoryName.toLowerCase().includes(q);
        const matchDesc = (product.shortDescription ?? '').toLowerCase().includes(q);
        if (!matchName && !matchCategory && !matchDesc) return false;
      }

      // Category filter
      if (selectedCategories.length === 0 || selectedCategories.includes('all')) {
        return true;
      }

      const pCatSlug = (product.categorySlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const pCatName = (product.categoryName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      return selectedCategories.some((catSlug) => {
        const targetClean = catSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!targetClean || targetClean === 'all') return true;
        return (
          pCatSlug === targetClean ||
          pCatName === targetClean ||
          (pCatSlug.length > 2 && targetClean.length > 2 && (pCatSlug.includes(targetClean) || targetClean.includes(pCatSlug)))
        );
      });
    });
  }, [products, selectedCategories, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [filteredProducts, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const resetFilters = () => {
    setSelectedCategories(['all']);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 dark:bg-slate-950">
      <div className="container-fit">
        {/* Filter Toolbar & Search */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-card">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search products by name, category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-11 rounded-full border-slate-200 pl-11 pr-4 text-sm focus-visible:ring-[#C81E4E] dark:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Grid Toggle */}
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-slate-200 p-1 dark:border-slate-800">
              <button
                onClick={() => setGridCols('3')}
                className={`rounded-full p-2 transition-colors ${
                  gridCols === '3' ? 'bg-[#1E1E1E] text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="3 Columns Grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridCols('2')}
                className={`rounded-full p-2 transition-colors ${
                  gridCols === '2' ? 'bg-[#1E1E1E] text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="2 Columns Grid"
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Category Sidebar */}
          <div className="lg:col-span-1">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onChange={handleCategoryChange}
              className="sticky top-24"
            />
          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              {/* Active Filter Indicators & Result Summary */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-foreground">{sortedProducts.length}</span> products
                  </span>
                </div>

                {(!selectedCategories.includes('all') || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 rounded-full text-xs font-semibold text-slate-900 hover:bg-slate-100 dark:text-white"
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Reset All Filters
                  </Button>
                )}
              </div>

              {/* Products Display */}
              {paginatedProducts.length > 0 ? (
                <div
                  className={`grid gap-6 items-start sm:grid-cols-2 ${
                    gridCols === '3' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
                  }`}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-card">
                  <SlidersHorizontal className="h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 font-sans text-xl font-bold text-slate-900 dark:text-foreground">
                    No Products Found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    We couldn't find any products matching your current filters or search query.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-[#1E1E1E] font-semibold text-white hover:bg-black"
                  >
                    View All Products
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {sortedProducts.length > 0 && (
              <div className="mt-10">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1E1E1E] border-t-transparent"></div>
        <p className="mt-4 text-sm text-slate-500">Loading products...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
