'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingBag,
  Info,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Phone,
  MessageCircle,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/store/product-card';
import { useStore } from '@/components/store/store-provider';
import { SEED_PRODUCTS } from '@/lib/data';
import { formatINR, discountPercent } from '@/lib/format';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Find product by slug from SEED_PRODUCTS or database fallback
  const product = SEED_PRODUCTS.find((p) => p.slug === slug) ?? SEED_PRODUCTS[0];

  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wished = isInWishlist(product.id);

  // Gallery state
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // Options state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>('description');

  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(
      `${product.name} (${quantity}x) ${
        selectedSize ? `[${selectedSize}]` : ''
      } added to bag!`
    );
  };

  // Related products
  const relatedProducts = SEED_PRODUCTS.filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug
  ).slice(0, 4);

  const fallbackRelated = relatedProducts.length > 0
    ? relatedProducts
    : SEED_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 dark:bg-slate-950">
      <div className="container-fit">
        {/* Top Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium sm:text-sm">
          <Link href="/" className="hover:text-[#C81E4E] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-[#C81E4E] transition-colors">
            Shop
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link
            href={`/products?category=${product.categorySlug}`}
            className="hover:text-[#C81E4E] transition-colors"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 line-clamp-1 dark:text-foreground">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section: Image Gallery (Left) & Info Column (Right) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Side: Thumbnail List + Main Display Image */}
          <div className="lg:col-span-7 flex flex-col-reverse gap-4 sm:flex-row">
            {/* Vertical Thumbnail Navigation */}
            <div className="flex flex-row gap-3 overflow-x-auto sm:flex-col sm:overflow-y-auto sm:w-24 shrink-0">
              {images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={cn(
                    'relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl bg-white p-1 transition-all duration-200 border-2',
                    selectedImage === imgUrl
                      ? 'border-[#1E1E1E] shadow-md scale-102'
                      : 'border-slate-200 opacity-70 hover:opacity-100 dark:border-slate-800'
                  )}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image Container */}
            <div className="relative flex-1 aspect-square sm:aspect-[4/5] overflow-hidden rounded-[32px] border border-slate-100 bg-[#F5F2EC] dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-center p-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-contain transition-all duration-500 hover:scale-105"
              />

              {discount > 0 && (
                <Badge className="absolute left-6 top-6 border-0 bg-[#1E1E1E] px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  -{discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Right Side: Product Details & Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category Pill */}
              <div className="mb-3">
                <span className="inline-block rounded-full bg-[#1E1E1E] px-4 py-1.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-sm">
                  {product.badge || product.categoryName}
                </span>
              </div>

              {/* Rating Row */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  ({product.rating}/5)
                </span>
                <span className="text-xs text-slate-400">
                  ({product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Main Product Title */}
              <h1 className="font-sans text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl lg:text-3xl dark:text-foreground">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                  {formatINR(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg font-medium text-slate-400 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* In Stock Availability Notice */}
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>In Stock & Ready for Express Dispatch</span>
              </div>

              {/* Quantity Stepper & Add To Cart Button Row */}
              <div className="mt-8 flex items-center gap-3">
                {/* Stepper capsule */}
                <div className="flex h-11 items-center justify-between rounded-full border border-slate-200 bg-white px-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Add To Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1E1E1E] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-black active:scale-95 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <ShoppingBag className="h-4 w-4 text-white" />
                  Add To Cart
                </button>

                {/* Wishlist Heart Button */}
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist');
                  }}
                  aria-label="Toggle Wishlist"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900"
                >
                  <Heart
                    className={cn(
                      'h-4 w-4 transition-colors',
                      wished ? 'fill-[#1E1E1E] text-[#1E1E1E]' : 'text-slate-400 hover:text-[#1E1E1E]'
                    )}
                  />
                </button>
              </div>

              {/* Highlights & Guarantees */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-6 dark:border-slate-800">
                <div className="flex flex-col items-center text-center p-2">
                  <Truck className="h-5 w-5 text-slate-900 dark:text-white" />
                  <span className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Free Express Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <ShieldCheck className="h-5 w-5 text-slate-900 dark:text-white" />
                  <span className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    100% Authentic Quality
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <RotateCcw className="h-5 w-5 text-slate-900 dark:text-white" />
                  <span className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Easy Service & Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specification & Description Box */}
        <div className="mt-16 rounded-[32px] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-card">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('description')}
              className={cn(
                'pb-4 px-4 text-sm sm:text-base font-bold transition-all relative',
                activeTab === 'description'
                  ? 'text-[#1E1E1E] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Description & Details
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1E1E] rounded-full dark:bg-white" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('specifications')}
              className={cn(
                'pb-4 px-4 text-sm sm:text-base font-bold transition-all relative',
                activeTab === 'specifications'
                  ? 'text-[#1E1E1E] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Specifications
              {activeTab === 'specifications' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1E1E] rounded-full dark:bg-white" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={cn(
                'pb-4 px-4 text-sm sm:text-base font-bold transition-all relative',
                activeTab === 'shipping'
                  ? 'text-[#1E1E1E] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Shipping & Warranty
              {activeTab === 'shipping' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1E1E] rounded-full dark:bg-white" />
              )}
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'description' && (
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                <p>{product.description || product.shortDescription}</p>
                <p>
                  Engineered with direct manufacturer-grade quality, providing ultimate daily recovery, comfort, and performance for your home and lifestyle.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(product.specifications || [
                  { label: 'Category', value: product.categoryName },
                  { label: 'Subcategory', value: product.subCategoryName || 'N/A' },
                  { label: 'Warranty', value: 'Manufacturer Warranty Included' },
                  { label: 'Service', value: 'Nationwide On-Site Service' }
                ]).map((spec, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                    <span className="font-semibold text-slate-500 text-sm">{spec.label}</span>
                    <span className="font-bold text-slate-900 text-sm dark:text-slate-200">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>• Fast nationwide delivery across India.</p>
                <p>• Free on-site installation and guided product demo by expert technicians.</p>
                <p>• Up to 3 years coverage with nationwide service support.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="mt-20">
          <h2 className="mb-8 font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-foreground">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackRelated.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Contact Buttons on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* WhatsApp Icon Button */}
        <a
          href={`https://wa.me/${SITE.headOfficePhone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6 fill-white" />
        </a>

        {/* Phone Call Icon Button */}
        <a
          href={`tel:${SITE.headOfficePhone}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E1E1E] text-white shadow-xl transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Call Customer Care"
        >
          <Phone className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
