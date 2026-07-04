import { Hero } from '@/components/home/hero';
import { CategorySection } from '@/components/home/category-section';
import { Features } from '@/components/home/features';
import { CTASection } from '@/components/home/cta-section';
import { NewsSection } from '@/components/home/news-section';
import { ContactCTA } from '@/components/common/contact-cta';
import { organizationJsonLd } from '@/lib/seo';
// Thay đổi getAllProducts thành fetchAllProducts theo đúng gợi ý của hệ thống
import { getAllCategories, fetchAllProducts } from '@/lib/supabase-data';

export const revalidate = 3600;

export default async function HomePage() {
  // Lấy dữ liệu danh mục và sản phẩm trực tiếp từ Server
  const categories = getAllCategories();
  const allProducts = await fetchAllProducts(); // Đổi tên hàm tại đây

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <Hero />
      
      {/* Truyền dữ liệu chính xác vào component */}
      <CategorySection categories={categories} allProducts={allProducts} />
      
      <Features />
      <CTASection />
      <NewsSection />
      <ContactCTA />
    </>
  );
}
