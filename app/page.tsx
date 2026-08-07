import HeroSlider from '@/components/sections/hero-slider';
import { CategoryGrid } from '@/components/sections/category-grid';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { WhyChoose } from '@/components/sections/why-choose';
import { StatsSection } from '@/components/sections/stats-section';
import { Testimonials } from '@/components/sections/testimonials';
import { FaqSection } from '@/components/sections/faq-section';
import { InstagramGallery } from '@/components/sections/instagram-gallery';
import { CtaBanner } from '@/components/sections/cta-banner';
import { getCategories, getProducts } from '@/lib/queries';

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
  ]);

  return (
    <>
      <HeroSlider />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} />
      <WhyChoose />
      <StatsSection />
      <CtaBanner />
      <Testimonials />
      <InstagramGallery />
      <FaqSection />
    </>
  );
}
