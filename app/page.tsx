import { Suspense } from 'react';
import HeroSlider from '@/components/sections/hero-slider';
import { CategoryGrid } from '@/components/sections/category-grid';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { NewArrivals } from '@/components/sections/new-arrivals';
import { WhyChoose } from '@/components/sections/why-choose';
import { StatsSection } from '@/components/sections/stats-section';
import { Testimonials } from '@/components/sections/testimonials';
import { FaqSection } from '@/components/sections/faq-section';
import { InstagramGallery } from '@/components/sections/instagram-gallery';
import { CtaBanner } from '@/components/sections/cta-banner';
import { getCategories, getProducts } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function CatalogSections() {
  const [categories, products, newArrivals] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 40 }),
  ]);

  return (
    <>
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} />
      <NewArrivals products={newArrivals} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Suspense fallback={null}>
        <CatalogSections />
      </Suspense>
      <WhyChoose />
      <StatsSection />
      <CtaBanner />
      <Testimonials />
      <InstagramGallery />
      <FaqSection />
    </>
  );
}
