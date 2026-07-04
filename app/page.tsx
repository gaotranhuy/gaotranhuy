import { Hero } from '@/components/home/hero';
import { CategorySection } from '@/components/home/category-section';
import { FeaturedProducts } from '@/components/home/featured-products'; // Đã giữ lại dòng này
import { Features } from '@/components/home/features';
import { CTASection } from '@/components/home/cta-section';
import { NewsSection } from '@/components/home/news-section';
import { ContactCTA } from '@/components/common/contact-cta';
import { organizationJsonLd } from '@/lib/seo';
import { getAllCategories, fetchAllProducts } from '@/lib/supabase-data';

export const revalidate = 3600;

export default async function HomePage() {
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
      
      {/* Thanh danh mục cuộn ngang bám dính */}
      <CategorySection categories={categories} allProducts={allProducts} />
      
      {/* Đã đưa Sản phẩm nổi bật quay trở lại vị trí cũ */}
      <FeaturedProducts />
      
      <Features />
      <CTASection />
      <NewsSection />
      <ContactCTA />
    </>
  );
}
