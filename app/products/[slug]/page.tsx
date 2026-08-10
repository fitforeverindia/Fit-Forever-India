'use client';

import { useState, useEffect } from 'react';
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
  Award,
  Layers,
  Box,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/store/product-card';
import { useStore } from '@/components/store/store-provider';
import { useProductsStore } from '@/lib/products-store';
import { formatINR, discountPercent } from '@/lib/format';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { Product, ColorVariant } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { products } = useProductsStore();

  // Find product by slug from dynamic store
  const product = products.find((p) => p.slug === slug) ?? products[0];

  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wished = product ? isInWishlist(product.id) : false;

  // Options & Color Variants State
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | null>(
    product?.colorVariants && product.colorVariants.length > 0 ? product.colorVariants[0] : null
  );

  // Gallery state - reactive to selected color variant!
  const currentGallery =
    selectedColorVariant && selectedColorVariant.imageUrls && selectedColorVariant.imageUrls.length > 0
      ? selectedColorVariant.imageUrls
      : product?.gallery && product.gallery.length > 0
      ? product.gallery
      : [product?.image || ''];

  const [selectedImage, setSelectedImage] = useState<string>(currentGallery[0] || product?.image || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'logistics'>('description');

  // Update selected image when color variant changes
  useEffect(() => {
    if (product?.colorVariants && product.colorVariants.length > 0) {
      const first = product.colorVariants[0];
      setSelectedColorVariant(first);
      if (first.imageUrls && first.imageUrls.length > 0) {
        setSelectedImage(first.imageUrls[0]);
      }
    } else if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!product) {
    return notFound();
  }

  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleSelectColorVariant = (variant: ColorVariant) => {
    setSelectedColorVariant(variant);
    if (variant.imageUrls && variant.imageUrls.length > 0) {
      setSelectedImage(variant.imageUrls[0]);
    }
    toast.info(`Selected color variant: ${variant.colorName}`);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(
      `${product.name} (${quantity}x) ${
        selectedColorVariant ? `[${selectedColorVariant.colorName}]` : ''
      } added to bag!`
    );
  };

  // Related products from dynamic store
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : products.filter((p) => p.id !== product.id).slice(0, 4);

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
              {currentGallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={cn(
                    'relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl bg-white p-1 transition-all duration-200 border-2 shrink-0',
                    selectedImage === imgUrl
                      ? 'border-[#1E1E1E] shadow-md scale-102 dark:border-white'
                      : 'border-slate-200 opacity-70 hover:opacity-100 dark:border-slate-800'
                  )}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-contain rounded-xl"
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

              {product.model && (
                <div className="absolute right-6 top-6 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white">
                  Model: {product.model}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Product Details & Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Badge Pills */}
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="inline-block rounded-full bg-[#1E1E1E] px-4 py-1.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-sm">
                  {product.badge || product.categoryName}
                </span>
                {product.model && (
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {product.model}
                  </span>
                )}
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
                  ({product.reviewCount} verified customer reviews)
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
                <span>In Stock & Ready for Free Express Dispatch</span>
              </div>

              {/* COLOR / VARIANT SELECTOR */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span>Select Color / Finish:</span>
                    <span className="text-primary font-medium">
                      {selectedColorVariant?.colorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {product.colorVariants.map((variant, idx) => {
                      const isSelected = selectedColorVariant?.colorName === variant.colorName;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectColorVariant(variant)}
                          className={cn(
                            'flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all border',
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white shadow-md dark:border-white dark:bg-white dark:text-slate-900'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                          )}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: variant.colorCode || '#2C1D11' }}
                          />
                          <span>{variant.colorName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CERTIFICATIONS BADGES */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">
                    Quality & Safety Certifications:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                      >
                        <Award className="h-3 w-3" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                    3 Year Warranty Included
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <RotateCcw className="h-5 w-5 text-slate-900 dark:text-white" />
                  <span className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    On-Site Tech Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specification & Description Box */}
        <div className="mt-16 rounded-[32px] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-card">
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('description')}
              className={cn(
                'pb-4 px-2 text-sm sm:text-base font-bold transition-all relative',
                activeTab === 'description'
                  ? 'text-[#1E1E1E] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Description & Highlights
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1E1E] rounded-full dark:bg-white" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('specifications')}
              className={cn(
                'pb-4 px-2 text-sm sm:text-base font-bold transition-all relative',
                activeTab === 'specifications'
                  ? 'text-[#1E1E1E] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Technical Specs & Dimensions
              {activeTab === 'specifications' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1E1E] rounded-full dark:bg-white" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('logistics')}
              className={cn(
                'pb-4 px-2 text-sm sm:text-base font-bold transition-all relative',
                activeTab === 'logistics'
                  ? 'text-[#1E1E1E] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Logistics & Certifications
              {activeTab === 'logistics' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E1E1E] rounded-full dark:bg-white" />
              )}
            </button>
          </div>

          <div className="pt-6">
            {/* TAB 1: DESCRIPTION (MARKDOWN RENDERED) */}
            {activeTab === 'description' && (
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {product.description ? (
                  <div className="prose prose-slate dark:prose-invert max-w-none space-y-3">
                    {product.description.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="font-display font-bold text-lg text-slate-900 dark:text-white mt-4">
                            {line.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('* ')) {
                        return (
                          <li key={idx} className="ml-5 list-disc text-slate-700 dark:text-slate-300">
                            {line.replace('* ', '')}
                          </li>
                        );
                      }
                      if (line.startsWith('|')) {
                        return (
                          <div key={idx} className="font-mono text-xs overflow-x-auto py-1 text-slate-800 dark:text-slate-200">
                            {line}
                          </div>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                ) : (
                  <p>{product.shortDescription}</p>
                )}
              </div>
            )}

            {/* TAB 2: TECHNICAL SPECS & DIMENSIONS TABLE */}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-primary">
                    Electrical & Engineering Specs
                  </h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Model Number</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{product.model || 'AM-333'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Rated Voltage</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.ratedVoltage || '220V - 240V'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Rated Frequency</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.ratedFrequency || '50/60Hz'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Rated Power</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.ratedPower || '150W'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Safety Class</span>
                      <span className="text-slate-800 dark:text-slate-200">{product.safetyClass || 'Class I Isolation'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Noise Level</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.noiseLevel || '≤ 60dB'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-primary">
                    Weight & Dimensions
                  </h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Net Weight (KG)</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{product.netWeight || '85 KG'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Gross Weight (KG)</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.grossWeight || '98 KG'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Sit-Up Dimensions (L x W x H)</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.dimensionsSitUp || '145 x 75 x 115 cm'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Lay-Down Dimensions (L x W x H)</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.dimensionsLayDown || '180 x 75 x 85 cm'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-semibold text-slate-500">Package Dimensions</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{product.packageSize || '150 x 80 x 120 cm'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LOGISTICS & CERTIFICATIONS */}
            {activeTab === 'logistics' && (
              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-2">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    Shipping & Container Logistics QTY:
                  </p>
                  <p className="font-mono text-xs text-primary font-bold">
                    {product.containerQty || '20FT: 24 units | 40HQ: 54 units'}
                  </p>
                  <p className="text-slate-500">
                    Direct factory wholesale packing available for commercial buyers and dealership distribution across Pan-India.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-2">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    Quality Assurance & Certifications:
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    This equipment has undergone rigorous safety and durability testing certified under international standards:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {(product.certifications || ['ISO9001:2015', 'FDA', 'CE', 'KC', 'RoHS', 'ETL']).map((cert) => (
                      <span
                        key={cert}
                        className="rounded-lg bg-white px-3 py-1.5 font-bold text-slate-900 border border-slate-200 shadow-2xs dark:bg-slate-800 dark:text-white dark:border-slate-700"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
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
        <a
          href={`https://wa.me/${SITE.headOfficePhone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6 fill-white" />
        </a>

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
