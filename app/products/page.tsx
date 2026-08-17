'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Grid3X3, Grid2X2, RotateCcw } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import { PaginationControl } from '@/components/ui/pagination-control';
import { PageLoader } from '@/components/ui/page-loader';
import { Reveal } from '@/components/ui/reveal';
import { useProductsStore } from '@/lib/products-store';
import { useCategoriesStore } from '@/lib/categories-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product } from '@/lib/types';

const ITEMS_PER_PAGE = 6;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category');

  const { products } = useProductsStore();
  const { categories } = useCategoriesStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [gridCols, setGridCols] = useState<'3' | '2'>('3');

  // Update category if URL parameter changes
  useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
  }, [initialCategory]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === selectedCategory) || null,
    [categories, selectedCategory]
  );

  // Reset page to 1 when filters change and sync URL
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    if (slug && slug !== 'all') {
      router.push(`/products?category=${slug}`, { scroll: false });
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
      if (!selectedCategory || selectedCategory === 'all') {
        return true;
      }

      const pCatSlug = (product.categorySlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const pCatName = (product.categoryName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetClean = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '');

      return (
        pCatSlug === targetClean ||
        pCatName === targetClean ||
        (pCatSlug.length > 2 && targetClean.length > 2 && (pCatSlug.includes(targetClean) || targetClean.includes(pCatSlug)))
      );
    });
  }, [products, selectedCategory, searchQuery]);

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
    handleCategoryChange('all');
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white pb-16 dark:bg-slate-950">
      {/* Category Banner */}
      {activeCategory && activeCategory.bannerImage ? (
        <div className="relative flex aspect-[8/7] w-full items-center justify-center overflow-hidden bg-slate-100 sm:aspect-[5/2] dark:bg-slate-900">
          {/* Blurred fill so there are no empty letterbox bars if the viewport ratio differs slightly */}
          <picture>
            <source media="(min-width: 640px)" srcSet={activeCategory.bannerImage} />
            <img
              src={activeCategory.bannerImageMobile || activeCategory.bannerImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
            />
          </picture>
          <picture>
            <source media="(min-width: 640px)" srcSet={activeCategory.bannerImage} />
            <img
              src={activeCategory.bannerImageMobile || activeCategory.bannerImage}
              alt={activeCategory.name}
              className="relative h-full w-full object-contain"
            />
          </picture>
        </div>
      ) : null}

      <div className="container-fit pt-6 sm:pt-8">
        {/* Filter Toolbar & Search */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] sm:flex-row sm:items-center sm:justify-between dark:border-border dark:bg-card">
          <div className="group relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
            <Input
              type="text"
              placeholder="Search products by name, category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-11 rounded-full border-slate-200 pl-11 pr-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Categories Dropdown */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-11 flex-1 rounded-full border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#1E1E1E]/40 focus:ring-2 focus:ring-[#1E1E1E] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 sm:w-auto sm:flex-none [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-70">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800">
                <SelectItem value="all" className="rounded-xl text-xs font-semibold">
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug} className="rounded-xl text-xs font-semibold">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="h-11 flex-1 rounded-full border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#1E1E1E]/40 focus:ring-2 focus:ring-[#1E1E1E] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 sm:w-auto sm:flex-none [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:opacity-70">
                <SelectValue placeholder="Sort by: Featured" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800">
                <SelectItem value="featured" className="rounded-xl text-xs font-semibold">
                  Sort by: Featured
                </SelectItem>
                <SelectItem value="price-asc" className="rounded-xl text-xs font-semibold">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-desc" className="rounded-xl text-xs font-semibold">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="rating" className="rounded-xl text-xs font-semibold">
                  Highest Rated
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Grid Toggle */}
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-slate-200 p-1 dark:border-slate-800">
              <button
                onClick={() => setGridCols('3')}
                className={`rounded-full p-2 transition-all duration-300 ${
                  gridCols === '3' ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-slate-500 hover:scale-110 hover:text-slate-900'
                }`}
                aria-label="3 Columns Grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridCols('2')}
                className={`rounded-full p-2 transition-all duration-300 ${
                  gridCols === '2' ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-slate-500 hover:scale-110 hover:text-slate-900'
                }`}
                aria-label="2 Columns Grid"
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex flex-col justify-between">
            <div>
              {/* Active Filter Indicators & Result Summary */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-foreground">{sortedProducts.length}</span> products
                  </span>
                </div>

                {(selectedCategory !== 'all' || searchQuery) && (
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
                  className={`grid grid-cols-2 gap-3 sm:gap-6 items-start ${
                    gridCols === '3' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
                  }`}
                >
                  {paginatedProducts.map((product, i) => (
                    <Reveal key={product.id} delay={(i % ITEMS_PER_PAGE) * 0.05}>
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-card">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-muted">
                    <SlidersHorizontal className="h-9 w-9 text-slate-300" />
                  </div>
                  <h3 className="mt-5 font-sans text-xl font-bold text-slate-900 dark:text-foreground">
                    No Products Found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    We couldn't find any products matching your current filters or search query.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-[#1E1E1E] font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
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
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32">
        <PageLoader message="Loading products..." />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
