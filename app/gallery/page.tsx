'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/sections/page-header';
import { Reveal } from '@/components/ui/reveal';
import { CATEGORY_IMAGES } from '@/lib/site';
import { X, ZoomIn } from 'lucide-react';

const GALLERY = [
  { src: CATEGORY_IMAGES['massage-chairs'], alt: 'Massage Chair', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['spin-bike'], alt: 'Spin Bike', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['home-gym'], alt: 'Home Gym', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['leg-massager'], alt: 'Leg Massager', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['foot-massager'], alt: 'Foot Massager', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['health-mate'], alt: 'Health Mate', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['jogpad'], alt: 'JogPad', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['handy-body-massager'], alt: 'Handy Body Massager', fit: 'object-contain', bg: 'bg-[#F8F9FA]' },
  { src: CATEGORY_IMAGES['treadmill'], alt: 'Treadmill', fit: 'object-cover', bg: 'bg-[#F8F9FA]' },
];

export default function GalleryPage() {
  const [selectedImg, setSelectedImg] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Explore our full collection of premium fitness and wellness equipment."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
      />

      <section className="py-16 sm:py-24">
        <div className="container-fit">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((item, i) => (
              <Reveal
                key={i}
                delay={i * 0.05}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card dark:border-border"
              >
                <div
                  className={`relative aspect-[4/3] w-full p-4 ${item.bg} dark:bg-secondary`}
                  onClick={() => setSelectedImg(item)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className={`h-full w-full ${item.fit} transition-transform duration-700 ease-out group-hover:scale-105`}
                  />

                  {/* Zoom indicator overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-foreground shadow-md backdrop-blur">
                      <ZoomIn className="h-4 w-4 text-primary" />
                      View Image
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-card border-t border-slate-100 dark:border-border">
                  <h3 className="font-sans text-base font-bold text-slate-900 dark:text-foreground">
                    {item.alt}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-4 dark:bg-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white transition-colors hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedImg.src}
              alt={selectedImg.alt}
              className="max-h-[80vh] w-full object-contain rounded-xl"
            />
            <p className="mt-3 text-center font-sans font-bold text-lg text-slate-900 dark:text-foreground">
              {selectedImg.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

