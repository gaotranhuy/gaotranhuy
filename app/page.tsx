import { Hero } from '@/components/home/hero';
import { CategorySection } from '@/components/home/category-section';
import { Features } from '@/components/home/features';
import { CTASection } from '@/components/home/cta-section';
import { NewsSection } from '@/components/home/news-section';
import { ContactCTA } from '@/components/common/contact-cta';
import { organizationJsonLd } from '@/lib/seo';
import { getAllCategories, fetchAllProducts } from '@/lib/supabase-data';

export const revalidate = 3600;

export default async function HomePage() {
  // Lấy dữ liệu đồng bộ và bất động bộ chính xác từ file supabase-data của bạn
  const categories = getAllCategories();
  const allProducts = await fetchAllProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <Hero />
      
      {/* Truyền dữ liệu xuống component con */}
      <CategorySection categories={categories} allProducts={allProducts} />
      
      <Features />
      <CTASection />
      <NewsSection />
      <ContactCTA />
    </>
  );
}
