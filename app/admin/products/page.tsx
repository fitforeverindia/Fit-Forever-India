'use client';

import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Image as ImageIcon,
  IndianRupee,
  Sparkles,
  Layers,
  Sliders,
  Ruler,
  Truck,
  Award,
  FileText,
  Palette,
  Check,
  RotateCcw,
  CloudUpload,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SEED_CATEGORIES } from '@/lib/data';
import { useProductsStore } from '@/lib/products-store';
import { useCategoriesStore } from '@/lib/categories-store';
import { ImageUploadDropzone } from '@/components/admin/image-upload-dropzone';
import type { Product, ColorVariant } from '@/lib/types';



const CERTIFICATION_OPTIONS = [
  'ISO9001:2015',
  'FDA',
  'CE',
  'KC',
  'RoHS',
  'ETL',
];

const DEFAULT_COLOR_VARIANTS: ColorVariant[] = [
  {
    colorName: 'Royal Black / Brown',
    colorCode: '#2C1D11',
    imageUrls: ['https://images.pexels.com/photos/4198567/pexels-photo-4198567.jpeg?auto=compress&cs=tinysrgb&w=900'],
    inStock: true,
  },
  {
    colorName: 'Space Grey / Blue',
    colorCode: '#3A4B5C',
    imageUrls: ['https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=900'],
    inStock: true,
  },
];

const EMPTY_FORM_DATA: {
  name: string;
  model: string;
  slug: string;
  categorySlug: string;
  price: number;
  compareAtPrice: number | string;
  badge: string;
  image: string;
  shortDescription: string;
  description: string;
  featured: boolean;
  inStock: boolean;
  ratedVoltage: string;
  ratedFrequency: string;
  ratedPower: string;
  safetyClass: string;
  ratedTime: string;
  noiseLevel: string;
  airPressure: string;
  netWeight: string;
  grossWeight: string;
  dimensionsSitUp: string;
  dimensionsLayDown: string;
  packageSize: string;
  containerQty: string;
  massageTechniques: string;
  autoProgramsCount: string;
  railType: string;
  aiBodyDetection: string;
  heating: string;
  airbagZones: string;
  voiceControl: string;
  bluetoothSpeaker: string;
  remoteType: string;
  charging: string;
  certifications: string[];
  colorVariants: ColorVariant[];
} = {
  name: '',
  model: '',
  slug: '',
  categorySlug: 'massage-chairs',
  price: 0,
  compareAtPrice: '',
  badge: '',
  image: '',
  shortDescription: '',
  description: '',
  featured: true,
  inStock: true,
  ratedVoltage: '',
  ratedFrequency: '',
  ratedPower: '',
  safetyClass: '',
  ratedTime: '',
  noiseLevel: '',
  airPressure: '',
  netWeight: '',
  grossWeight: '',
  dimensionsSitUp: '',
  dimensionsLayDown: '',
  packageSize: '',
  containerQty: '',
  massageTechniques: '',
  autoProgramsCount: '',
  railType: '',
  aiBodyDetection: '',
  heating: '',
  airbagZones: '',
  voiceControl: '',
  bluetoothSpeaker: '',
  remoteType: '',
  charging: '',
  certifications: [],
  colorVariants: [],
};


export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProductsStore();
  const { categories } = useCategoriesStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [showMarkdownPreview, setShowMarkdownPreview] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.model && p.model.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || p.categorySlug === selectedCategory;
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'instock'
        ? p.inStock
        : !p.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setActiveTab('basic');
    setFormData(EMPTY_FORM_DATA);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('basic');
    setFormData({
      name: product.name,
      model: product.model || '',
      slug: product.slug,
      categorySlug: product.categorySlug,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? '',
      badge: product.badge ?? '',
      image: product.image,
      shortDescription: product.shortDescription ?? '',
      description: product.description ?? '',
      featured: product.featured,
      inStock: product.inStock,
      ratedVoltage: product.ratedVoltage || '',
      ratedFrequency: product.ratedFrequency || '',
      ratedPower: product.ratedPower || '',
      safetyClass: product.safetyClass || '',
      ratedTime: product.ratedTime || '',
      noiseLevel: product.noiseLevel || '',
      airPressure: product.airPressure || '',
      netWeight: product.netWeight || '',
      grossWeight: product.grossWeight || '',
      dimensionsSitUp: product.dimensionsSitUp || '',
      dimensionsLayDown: product.dimensionsLayDown || '',
      packageSize: product.packageSize || '',
      containerQty: product.containerQty || '',
      massageTechniques: product.massageTechniques || '',
      autoProgramsCount: product.autoProgramsCount || '',
      railType: product.railType || '',
      aiBodyDetection: product.aiBodyDetection || '',
      heating: product.heating || '',
      airbagZones: product.airbagZones || '',
      voiceControl: product.voiceControl || '',
      bluetoothSpeaker: product.bluetoothSpeaker || '',
      remoteType: product.remoteType || '',
      charging: product.charging || '',
      certifications: product.certifications || [],
      colorVariants: product.colorVariants || [],
    });
    setIsModalOpen(true);
  };


  const handleToggleCertification = (cert: string) => {
    setFormData((prev) => {
      const exists = prev.certifications.includes(cert);
      const updated = exists
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert];
      return { ...prev, certifications: updated };
    });
  };

  const handleAddColorVariant = () => {
    setFormData((prev) => ({
      ...prev,
      colorVariants: [
        ...prev.colorVariants,
        {
          colorName: 'New Variant (e.g. Blue/Grey)',
          colorCode: '#3B82F6',
          imageUrls: [prev.image],
          inStock: true,
        },
      ],
    }));
  };

  const handleUpdateColorVariant = (index: number, key: keyof ColorVariant, value: any) => {
    setFormData((prev) => {
      const copy = [...prev.colorVariants];
      copy[index] = { ...copy[index], [key]: value };
      return { ...prev, colorVariants: copy };
    });
  };

  const handleRemoveColorVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a product name');
      return;
    }

    const generatedSlug =
      formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const selectedCat = SEED_CATEGORIES.find((c) => c.slug === formData.categorySlug);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
      name: formData.name,
      model: formData.model,
      slug: generatedSlug,
      categorySlug: formData.categorySlug,
      categoryName: selectedCat?.name ?? formData.categorySlug,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      shortDescription: formData.shortDescription,
      description: formData.description,
      image: formData.image,
      gallery: formData.colorVariants.flatMap((cv) => cv.imageUrls).filter(Boolean).length > 0
        ? formData.colorVariants.flatMap((cv) => cv.imageUrls)
        : [formData.image],
      colorVariants: formData.colorVariants,
      colors: formData.colorVariants.map((cv) => cv.colorName),
      rating: editingProduct ? editingProduct.rating : 4.9,
      reviewCount: editingProduct ? editingProduct.reviewCount : 12,
      badge: formData.badge || null,
      featured: formData.featured,
      inStock: formData.inStock,

      // Specs & Dimensions
      ratedVoltage: formData.ratedVoltage,
      ratedFrequency: formData.ratedFrequency,
      ratedPower: formData.ratedPower,
      safetyClass: formData.safetyClass,
      ratedTime: formData.ratedTime,
      noiseLevel: formData.noiseLevel,
      airPressure: formData.airPressure,

      netWeight: formData.netWeight,
      grossWeight: formData.grossWeight,
      dimensionsSitUp: formData.dimensionsSitUp,
      dimensionsLayDown: formData.dimensionsLayDown,
      packageSize: formData.packageSize,

      containerQty: formData.containerQty,

      massageTechniques: formData.massageTechniques,
      autoProgramsCount: formData.autoProgramsCount,
      railType: formData.railType,
      aiBodyDetection: formData.aiBodyDetection,
      heating: formData.heating,
      airbagZones: formData.airbagZones,
      voiceControl: formData.voiceControl,
      bluetoothSpeaker: formData.bluetoothSpeaker,
      remoteType: formData.remoteType,
      charging: formData.charging,

      certifications: formData.certifications,
      specifications: [
        { label: 'Model', value: formData.model || 'AM-333' },
        { label: 'Voltage', value: formData.ratedVoltage },
        { label: 'Power', value: formData.ratedPower },
        { label: 'Net Weight', value: formData.netWeight },
        { label: 'Warranty', value: '3 Years On-Site Comprehensive Warranty' },
      ],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      toast.success(`Product "${formData.name}" updated successfully!`);
    } else {
      addProduct(productPayload);
      toast.success(`Product "${formData.name}" created and added to store!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      deleteProduct(id);
      toast.success(`Product "${name}" deleted`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Product Catalog ({products.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage equipment models, specifications, color swatches with Cloudinary media, and Markdown descriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Equipment
          </Button>
        </div>

      </div>

      {/* Toolbar - Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by title, model (e.g. AM-333, Z91), or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-slate-200 bg-slate-50 pl-10 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 focus:outline-none focus:border-primary"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 focus:outline-none focus:border-primary"
        >
          <option value="all">All Stock Status</option>
          <option value="instock">In Stock</option>
          <option value="outstock">Out of Stock</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50/80">
                <th className="py-3.5 px-4">Item & Model</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Colors & Swatches</th>
                <th className="py-3.5 px-4">Badge</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Inventory</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No equipment products matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-display font-bold text-slate-900 text-sm line-clamp-1">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              {p.model || 'AM-333'}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                        {p.categoryName || p.categorySlug}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      {p.compareAtPrice && (
                        <div className="font-mono text-[10px] text-slate-400 line-through">
                          ₹{p.compareAtPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.colorVariants && p.colorVariants.length > 0 ? (
                          p.colorVariants.map((cv, idx) => (
                            <span
                              key={idx}
                              className="h-4 w-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: cv.colorCode || '#3B82F6' }}
                              title={cv.colorName}
                            />
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {p.badge ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct(p.id, { featured: !p.featured })}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                          p.featured
                            ? 'border-amber-300 bg-amber-50 text-amber-600'
                            : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`h-4 w-4 ${p.featured ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                          p.inStock
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {p.inStock ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> In Stock
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-primary hover:text-primary"
                          title="Edit Product"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-red-500 hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Equipment Modal with Multi-Tab Standard Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white border-slate-200 text-slate-900 rounded-3xl p-6 shadow-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-slate-900 flex items-center justify-between">
              <span>{editingProduct ? 'Edit Equipment Model' : 'Add New Equipment Model'}</span>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                {formData.model || 'AM-333'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure basic info, Cloudinary color variants, technical specifications, logistics, certifications, and Markdown description.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="mt-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full bg-slate-100 p-1 rounded-2xl">
                <TabsTrigger value="basic" className="text-xs font-bold rounded-xl flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" /> Basic Info
                </TabsTrigger>
                <TabsTrigger value="colors" className="text-xs font-bold rounded-xl flex items-center gap-1">
                  <Palette className="h-3.5 w-3.5" /> Colors & Media
                </TabsTrigger>
                <TabsTrigger value="specs" className="text-xs font-bold rounded-xl flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5" /> Technical Specs
                </TabsTrigger>
                <TabsTrigger value="features" className="text-xs font-bold rounded-xl flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" /> Features & Certs
                </TabsTrigger>
                <TabsTrigger value="description" className="text-xs font-bold rounded-xl flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> Markdown Description
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: BASIC INFO */}
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Product Name</Label>
                    <Input
                      required
                      placeholder="e.g. Aura Pro 4D Luxury Massage Chair"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Product Model Number</Label>
                    <Input
                      required
                      placeholder="e.g. AM-333, A372-2, Z91, AM-6666"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Category</Label>
                    <select
                      value={formData.categorySlug}
                      onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 focus:outline-none focus:border-primary"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Selling Price (₹)</Label>
                    <Input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Original MSRP (₹)</Label>
                    <Input
                      type="number"
                      placeholder="Compare at price"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <ImageUploadDropzone
                      label="Main Product Cover Image"
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Badge Tag</Label>
                    <Input
                      placeholder="e.g. Best Seller, Hot, Sale, 20% OFF"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                    />
                  </div>
                </div>


                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase text-slate-700">Short Summary</Label>
                  <Input
                    placeholder="Brief 1-sentence product summary"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-800 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="rounded border-slate-300 text-primary"
                    />
                    In Stock & Available
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-800 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-slate-300 text-primary"
                    />
                    Feature on Homepage
                  </label>
                </div>
              </TabsContent>

              {/* TAB 2: COLOR VARIANTS & CLOUDINARY MEDIA */}
              <TabsContent value="colors" className="space-y-4 pt-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CloudUpload className="h-4 w-4 text-primary" />
                      Color / Variant Options with Cloudinary Images
                    </h4>
                    <p className="text-xs text-slate-500">
                      Add multiple color options (e.g. Brown/Black, Blue+Grey). Specify Cloudinary URLs for each variant.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddColorVariant}
                    className="bg-primary text-primary-foreground font-bold rounded-xl"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Color Variant
                  </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {formData.colorVariants.map((variant, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">Variant #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(idx)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold"
                        >
                          Remove Variant
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-[11px] font-semibold text-slate-700">Color Name</Label>
                          <Input
                            placeholder="e.g. Brown / Black"
                            value={variant.colorName}
                            onChange={(e) => handleUpdateColorVariant(idx, 'colorName', e.target.value)}
                            className="bg-slate-50 border-slate-200 text-xs rounded-xl h-9 mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-[11px] font-semibold text-slate-700">Color Swatch Hex</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={variant.colorCode || '#2C1D11'}
                              onChange={(e) => handleUpdateColorVariant(idx, 'colorCode', e.target.value)}
                              className="h-9 w-12 rounded-lg border border-slate-200 cursor-pointer"
                            />
                            <Input
                              placeholder="#2C1D11"
                              value={variant.colorCode}
                              onChange={(e) => handleUpdateColorVariant(idx, 'colorCode', e.target.value)}
                              className="bg-slate-50 border-slate-200 text-xs rounded-xl h-9 font-mono"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3 pt-2">
                          <ImageUploadDropzone
                            label={`Upload Variant Image (${variant.colorName})`}
                            value={variant.imageUrls[0] || ''}
                            onChange={(url) => handleUpdateColorVariant(idx, 'imageUrls', [url])}
                          />
                        </div>
                      </div>


                      {/* Live Thumbnail Preview */}
                      {variant.imageUrls[0] && (
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={variant.imageUrls[0]}
                            alt={variant.colorName}
                            className="h-10 w-10 object-contain rounded-lg border border-slate-200 bg-slate-50 p-0.5"
                          />
                          <span className="text-[11px] text-slate-500 font-mono truncate">
                            Preview: {variant.colorName} ({variant.colorCode})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* TAB 3: TECHNICAL SPECS & WEIGHT */}
              <TabsContent value="specs" className="space-y-4 pt-4">
                <h4 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Technical Specs & Weight
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Rated Voltage</Label>
                    <Input
                      placeholder="e.g. 100-240V / 220-240V"
                      value={formData.ratedVoltage}
                      onChange={(e) => setFormData({ ...formData, ratedVoltage: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Rated Frequency</Label>
                    <Input
                      placeholder="e.g. 50/60Hz"
                      value={formData.ratedFrequency}
                      onChange={(e) => setFormData({ ...formData, ratedFrequency: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Rated Power</Label>
                    <Input
                      placeholder="e.g. 150W, 100W, 180W"
                      value={formData.ratedPower}
                      onChange={(e) => setFormData({ ...formData, ratedPower: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Safety Design / Class</Label>
                    <Input
                      placeholder="e.g. Class I"
                      value={formData.safetyClass}
                      onChange={(e) => setFormData({ ...formData, safetyClass: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Rated Time</Label>
                    <Input
                      placeholder="e.g. 20min"
                      value={formData.ratedTime}
                      onChange={(e) => setFormData({ ...formData, ratedTime: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Noise Level</Label>
                    <Input
                      placeholder="e.g. ≤60dB"
                      value={formData.noiseLevel}
                      onChange={(e) => setFormData({ ...formData, noiseLevel: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Air Pressure</Label>
                    <Input
                      placeholder="e.g. 0.025-0.03MPa"
                      value={formData.airPressure}
                      onChange={(e) => setFormData({ ...formData, airPressure: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>
                </div>

                <h4 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider pt-2">
                  Weight & Dimensions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Net Weight (KG)</Label>
                    <Input
                      placeholder="e.g. 85 KG"
                      value={formData.netWeight}
                      onChange={(e) => setFormData({ ...formData, netWeight: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Gross Weight (KG)</Label>
                    <Input
                      placeholder="e.g. 98 KG"
                      value={formData.grossWeight}
                      onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Dimensions — Sit-Up</Label>
                    <Input
                      placeholder="L x W x H (e.g. 145 x 75 x 115 cm)"
                      value={formData.dimensionsSitUp}
                      onChange={(e) => setFormData({ ...formData, dimensionsSitUp: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Dimensions — Lay-Down</Label>
                    <Input
                      placeholder="L x W x H (e.g. 180 x 75 x 85 cm)"
                      value={formData.dimensionsLayDown}
                      onChange={(e) => setFormData({ ...formData, dimensionsLayDown: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Package Size</Label>
                    <Input
                      placeholder="L x W x H (e.g. 150 x 80 x 120 cm)"
                      value={formData.packageSize}
                      onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-semibold uppercase text-slate-700">QTY Per Container (Wholesale Logistics)</Label>
                  <Input
                    placeholder="e.g. 20FT: 24 units | 40HQ: 54 units"
                    value={formData.containerQty}
                    onChange={(e) => setFormData({ ...formData, containerQty: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono"
                  />
                </div>
              </TabsContent>

              {/* TAB 4: FEATURES & CERTIFICATIONS */}
              <TabsContent value="features" className="space-y-4 pt-4">
                <h4 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Feature Attributes List
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Massage Techniques</Label>
                    <Input
                      placeholder="Knead, Tap, Shiatsu, Knock, 3D/4D"
                      value={formData.massageTechniques}
                      onChange={(e) => setFormData({ ...formData, massageTechniques: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">No. of Auto Programs</Label>
                    <Input
                      placeholder="e.g. 12 Auto Programs"
                      value={formData.autoProgramsCount}
                      onChange={(e) => setFormData({ ...formData, autoProgramsCount: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Rail Type & Length</Label>
                    <Input
                      placeholder="SL guide rail, 137cm"
                      value={formData.railType}
                      onChange={(e) => setFormData({ ...formData, railType: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">AI / Body Detection</Label>
                    <Input
                      placeholder="Yes - Optical Sensor Scan"
                      value={formData.aiBodyDetection}
                      onChange={(e) => setFormData({ ...formData, aiBodyDetection: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Heating</Label>
                    <Input
                      placeholder="Graphene thermal heat therapy"
                      value={formData.heating}
                      onChange={(e) => setFormData({ ...formData, heating: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Airbag Count & Zones</Label>
                    <Input
                      placeholder="32 Airbags (shoulder, arm, calf, foot)"
                      value={formData.airbagZones}
                      onChange={(e) => setFormData({ ...formData, airbagZones: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Voice Control</Label>
                    <Input
                      placeholder="Yes - Offline Voice Commands"
                      value={formData.voiceControl}
                      onChange={(e) => setFormData({ ...formData, voiceControl: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">Bluetooth Speaker</Label>
                    <Input
                      placeholder="Yes - Hi-Fi 3D Surround Sound"
                      value={formData.bluetoothSpeaker}
                      onChange={(e) => setFormData({ ...formData, bluetoothSpeaker: e.target.value })}
                      className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10"
                    />
                  </div>
                </div>

                {/* Certifications Checkboxes */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-700">
                    Product Certifications
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {CERTIFICATION_OPTIONS.map((cert) => {
                      const isSelected = formData.certifications.includes(cert);
                      return (
                        <button
                          type="button"
                          key={cert}
                          onClick={() => handleToggleCertification(cert)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {cert}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* TAB 5: MARKDOWN DESCRIPTION & FORMATTING GUIDE */}
              <TabsContent value="description" className="space-y-4 pt-4">
                {/* Formatting Guide Banner (Matching User's Uploaded Screenshot) */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Formatting Guide (Markdown supported)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {showMarkdownPreview ? 'Edit Raw Text' : 'Toggle Live Render Preview'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                    <div>
                      <span className="text-slate-400">### Heading</span> → Section heading
                    </div>
                    <div>
                      <span className="text-slate-400">**bold text**</span> → <strong>Bold text</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">* item</span> → Bullet point
                    </div>
                    <div>
                      <span className="text-slate-400">*italic*</span> → <em>Italic text</em>
                    </div>
                    <div className="sm:col-span-2 text-[11px]">
                      <span className="text-slate-400">| Column 1 | Column 2 |</span> → Specification table
                    </div>
                  </div>
                </div>

                {showMarkdownPreview ? (
                  <div className="min-h-[220px] rounded-2xl border border-slate-200 bg-white p-4 text-xs space-y-3 text-slate-800">
                    <p className="font-semibold text-xs text-primary uppercase">Live Rendered Markdown Preview:</p>
                    <div className="prose prose-xs max-w-none space-y-2">
                      {formData.description.split('\n').map((line, idx) => {
                        if (line.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="font-display font-bold text-sm text-slate-900 mt-2">
                              {line.replace('### ', '')}
                            </h3>
                          );
                        }
                        if (line.startsWith('* ')) {
                          return (
                            <li key={idx} className="ml-4 list-disc text-slate-700">
                              {line.replace('* ', '')}
                            </li>
                          );
                        }
                        return <p key={idx} className="text-slate-600">{line}</p>;
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase text-slate-700">
                      Product Description (Markdown Format)
                    </Label>
                    <Textarea
                      required
                      rows={10}
                      placeholder="Write your product description here using Markdown format..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-50 border-slate-200 font-mono text-xs rounded-2xl p-4 text-slate-900 focus:bg-white"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-4 border-t border-slate-200 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-xl">
                {editingProduct ? 'Save Product Changes' : 'Publish Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
