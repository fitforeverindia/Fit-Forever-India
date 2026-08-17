'use client';

import { useState } from 'react';
import { GalleryHorizontal, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
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
import { ImageUploadDropzone } from '@/components/admin/image-upload-dropzone';
import { useHeroSlidesStore } from '@/lib/hero-slides-store';
import type { HeroSlide } from '@/lib/types';

const EMPTY_SLIDE_FORM = {
  eyebrow: '',
  title: '',
  subtitle: '',
  imageDesktop: '',
  imageMobile: '',
  primaryLabel: 'Shop Now',
  primaryHref: '/products',
  secondaryLabel: 'Explore Products',
  secondaryHref: '/products',
  isActive: true,
};

export default function AdminHeroPage() {
  const { slides, addSlide, updateSlide, deleteSlide } = useHeroSlidesStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState(EMPTY_SLIDE_FORM);
  const [saving, setSaving] = useState(false);

  const safeSlides = Array.isArray(slides) ? slides : [];
  const sortedSlides = [...safeSlides].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormData(EMPTY_SLIDE_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      eyebrow: slide.eyebrow ?? '',
      title: slide.title,
      subtitle: slide.subtitle ?? '',
      imageDesktop: slide.imageDesktop ?? '',
      imageMobile: slide.imageMobile ?? '',
      primaryLabel: slide.primaryLabel ?? 'Shop Now',
      primaryHref: slide.primaryHref ?? '/products',
      secondaryLabel: slide.secondaryLabel ?? 'Explore Products',
      secondaryHref: slide.secondaryHref ?? '/products',
      isActive: slide.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter a slide title');
      return;
    }
    if (!formData.imageDesktop) {
      toast.error('Please upload a laptop/desktop (16:9) banner image');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Saving hero slide...');

    try {
      if (editingSlide) {
        await updateSlide(editingSlide.id, formData);
        toast.success('Hero slide updated!', { id: toastId });
      } else {
        const nextOrder = sortedSlides.length > 0 ? Math.max(...sortedSlides.map((s) => s.sortOrder ?? 0)) + 1 : 0;
        await addSlide({ ...formData, sortOrder: nextOrder });
        toast.success('Hero slide added!', { id: toastId });
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save hero slide', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string, title: string) => {
    if (confirm(`Delete hero slide "${title}"?`)) {
      await deleteSlide(id);
      toast.success('Hero slide deleted');
    }
  };

  const handleMove = async (slide: HeroSlide, direction: 'up' | 'down') => {
    const idx = sortedSlides.findIndex((s) => s.id === slide.id);
    const swapWith = direction === 'up' ? sortedSlides[idx - 1] : sortedSlides[idx + 1];
    if (!swapWith) return;
    await Promise.all([
      updateSlide(slide.id, { sortOrder: swapWith.sortOrder ?? 0 }),
      updateSlide(swapWith.id, { sortOrder: slide.sortOrder ?? 0 }),
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Hero Banner ({sortedSlides.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage the homepage hero slider — laptop (16:9) & mobile (4:5) banners, headline text, and buttons.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      {sortedSlides.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <GalleryHorizontal className="h-10 w-10 text-slate-300" />
          <h3 className="mt-4 font-display text-lg font-bold text-slate-900">No hero slides yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            The homepage is currently showing the built-in default slides. Add a slide here to take over the homepage hero.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sortedSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                {slide.imageDesktop ? (
                  <img src={slide.imageDesktop} alt={slide.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <GalleryHorizontal className="h-10 w-10" />
                  </div>
                )}
                {!slide.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      Hidden
                    </span>
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                  Slide {i + 1}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{slide.eyebrow || '—'}</p>
                  <h3 className="mt-1 font-display font-bold text-slate-900 text-lg leading-tight">{slide.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{slide.subtitle}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMove(slide, 'up')}
                      disabled={i === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(slide, 'down')}
                      disabled={i === sortedSlides.length - 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => updateSlide(slide.id, { isActive: !slide.isActive })}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-amber-400 hover:text-amber-600"
                      title={slide.isActive ? 'Hide slide' : 'Show slide'}
                    >
                      {slide.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(slide)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-primary hover:text-primary"
                      title="Edit Slide"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(slide.id, slide.title)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:border-red-500 hover:text-red-600"
                      title="Delete Slide"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Slide Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white border-slate-200 text-slate-900 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-slate-900">
              {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Upload the laptop and mobile banner images and set the headline text & buttons.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSlide} className="space-y-4 mt-4">
            <ImageUploadDropzone
              label="Laptop / Desktop Banner (16:9)"
              value={formData.imageDesktop}
              onChange={(url) => setFormData({ ...formData, imageDesktop: url })}
            />

            <ImageUploadDropzone
              label="Mobile Banner (4:5)"
              value={formData.imageMobile}
              onChange={(url) => setFormData({ ...formData, imageMobile: url })}
            />

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Eyebrow (small tag above title)</Label>
              <Input
                placeholder="e.g. Premium Fitness Equipment"
                value={formData.eyebrow}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Title</Label>
              <Input
                required
                placeholder="e.g. Train. Recover. Live Better."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-50 border-slate-200 text-sm rounded-xl h-10 text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Subtitle</Label>
              <Textarea
                rows={2}
                placeholder="Short supporting line under the title"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl p-3 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Primary Button Label</Label>
                <Input
                  placeholder="Shop Now"
                  value={formData.primaryLabel}
                  onChange={(e) => setFormData({ ...formData, primaryLabel: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Primary Button Link</Label>
                <Input
                  placeholder="/products"
                  value={formData.primaryHref}
                  onChange={(e) => setFormData({ ...formData, primaryHref: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Secondary Button Label</Label>
                <Input
                  placeholder="Explore Products"
                  value={formData.secondaryLabel}
                  onChange={(e) => setFormData({ ...formData, secondaryLabel: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Secondary Button Link</Label>
                <Input
                  placeholder="/products"
                  value={formData.secondaryHref}
                  onChange={(e) => setFormData({ ...formData, secondaryHref: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-800 font-semibold cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-slate-300 text-primary"
              />
              Show on homepage
            </label>

            <DialogFooter className="pt-4 border-t border-slate-200 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-xl"
              >
                {editingSlide ? 'Save Slide Changes' : 'Create Slide'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
