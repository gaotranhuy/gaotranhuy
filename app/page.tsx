import { Hero } from '@/components/home/hero';
import { CategorySection } from '@/components/home/category-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { Features } from '@/components/home/features';
import { CTASection } from '@/components/home/cta-section';
import { NewsSection } from '@/components/home/news-section';
import { ContactCTA } from '@/components/common/contact-cta';
import { organizationJsonLd } from '@/lib/seo';
// 1. Import hàm lấy danh mục từ lib dữ liệu của bạn
import { getAllCategories } from '@/lib/supabase-data'; 

export const revalidate = 3600;

export default function HomePage() {
  // 2. Lấy dữ liệu danh mục ngay trên Server Component
  const categories = getAllCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <Hero />
      
      {/* 3. Truyền biến categories vào prop của component tại đây */}
      <CategorySection categories={categories} />
      
      <FeaturedProducts />
      <Features />
      <CTASection />
      <NewsSection />
      <ContactCTA />
    </>
  );
}
