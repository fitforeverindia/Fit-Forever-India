'use client';

import { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ImageUploadDropzone } from '@/components/admin/image-upload-dropzone';
import { useCategoriesStore } from '@/lib/categories-store';
import { useProductsStore } from '@/lib/products-store';
import type { Category } from '@/lib/types';

const EMPTY_CATEGORY_FORM = {
  name: '',
  slug: '',
  description: '',
  image: '',
  bannerImage: '',
  bannerImageMobile: '',
};

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoriesStore();
  const { products } = useProductsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState(EMPTY_CATEGORY_FORM);

  // Safety array check for categories and products
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData(EMPTY_CATEGORY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      image: cat.image,
      bannerImage: cat.bannerImage ?? '',
      bannerImageMobile: cat.bannerImageMobile ?? '',
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a category name');
      return;
    }

    const toastId = toast.loading('Uploading Cloudinary media & saving category...');

    let finalImage = formData.image;
    if (finalImage && finalImage.startsWith('data:image/')) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: finalImage }),
        });
        const uploadData = await res.json();
        if (uploadData.url) {
          finalImage = uploadData.url;
        }
      } catch (err) {
        console.error('Error uploading category image:', err);
      }
    }

    let finalBanner = formData.bannerImage;
    if (finalBanner && finalBanner.startsWith('data:image/')) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: finalBanner }),
        });
        const uploadData = await res.json();
        if (uploadData.url) {
          finalBanner = uploadData.url;
        }
      } catch (err) {
        console.error('Error uploading category banner:', err);
      }
    }

    let finalBannerMobile = formData.bannerImageMobile;
    if (finalBannerMobile && finalBannerMobile.startsWith('data:image/')) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: finalBannerMobile }),
        });
        const uploadData = await res.json();
        if (uploadData.url) {
          finalBannerMobile = uploadData.url;
        }
      } catch (err) {
        console.error('Error uploading category mobile banner:', err);
      }
    }

    const generatedSlug =
      formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name: formData.name,
        slug: generatedSlug,
        description: formData.description,
        image: finalImage,
        bannerImage: finalBanner,
        bannerImageMobile: finalBannerMobile,
      });
      toast.success(`Category "${formData.name}" updated successfully!`, { id: toastId });
    } else {
      const newCat: Category = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`,
        name: formData.name,
        slug: generatedSlug,
        description: formData.description,
        image: finalImage,
        bannerImage: finalBanner,
        bannerImageMobile: finalBannerMobile,
      };
      await addCategory(newCat);
      toast.success(`Created new category "${formData.name}"!`, { id: toastId });
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      await deleteCategory(id);
      toast.success(`Category "${name}" deleted`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Product Categories ({safeCategories.length})
          </h2>
          <p className="text-xs text-slate-500">
            Organize fitness lines, homepage circle grids, and navigation mega-menus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {safeCategories.map((cat) => {
          const count = safeProducts.filter((p) => p.categorySlug === cat.slug).length;

          return (
            <div
              key={cat.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <Layers className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-lg">
                      {cat.name}
                    </h3>
                    <p className="font-mono text-xs text-slate-400">/{cat.slug}</p>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      <Package className="h-3 w-3" />
                      {count} Products
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-600 line-clamp-2">
                  {cat.description || 'Premium e-commerce product line for home and studio wellness.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">ID: {cat.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-primary hover:text-primary"
                    title="Edit Category"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:border-red-500 hover:text-red-600"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-white border-slate-200 text-slate-900 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-slate-900">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure category name, slug, description, and drag-and-drop thumbnail image.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCategory} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Category Name</Label>
              <Input
                required
                placeholder="e.g. Massage Chairs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">URL Slug</Label>
              <Input
                placeholder="massage-chairs"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
              />
            </div>

            {/* DIRECT FILE UPLOAD DROPZONE */}
            <ImageUploadDropzone
              label="Category Thumbnail Image"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />

            <ImageUploadDropzone
              label="Category Page Banner — Desktop"
              hint="Recommended: professional, high-quality banner · 16:9 aspect ratio (e.g. 1920×1080px)"
              value={formData.bannerImage}
              onChange={(url) => setFormData({ ...formData, bannerImage: url })}
            />

            <ImageUploadDropzone
              label="Category Page Banner — Mobile"
              hint="Recommended: professional, high-quality banner · 4:5 aspect ratio (e.g. 1080×1350px)"
              value={formData.bannerImageMobile}
              onChange={(url) => setFormData({ ...formData, bannerImageMobile: url })}
            />

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Description</Label>
              <Input
                placeholder="Category summary for mega-menu and headers"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
              />
            </div>

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
                {editingCategory ? 'Save Category Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
