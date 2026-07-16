import { Hero } from '@/components/home/hero';
import { CategorySection } from '@/components/home/category-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Features } from '@/components/home/features';
import { CTASection } from '@/components/home/cta-section';
import { NewsSection } from '@/components/home/news-section';
import { ContactCTA } from '@/components/common/contact-cta';

import { organizationJsonLd } from '@/lib/seo';
import { fetchProductCount } from '@/lib/supabase-data';

export const revalidate = 3600;

export default async function HomePage() {
  const totalProducts = await fetchProductCount();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />

      <Hero totalProducts={totalProducts} />

      <CategorySection />
      <FeaturedProducts />
      <Features />
      <CTASection />
      <NewsSection />
      <ContactCTA />
    </>
  );
}
