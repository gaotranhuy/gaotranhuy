import { Hero } from '@/components/home/hero';
import { CategorySection } from '@/components/home/category-section';
import { Features } from '@/components/home/features';
import { CTASection } from '@/components/home/cta-section';
import { NewsSection } from '@/components/home/news-section';
import { ContactCTA } from '@/components/common/contact-cta';
import { organizationJsonLd } from '@/lib/seo';
// Import thêm 2 hàm lấy dữ liệu từ file Supabase của bạn
import { getAllCategories, getAllProducts } from '@/lib/supabase-data';

export const revalidate = 3600;

export default async function HomePage() {
  // Lấy dữ liệu danh mục và sản phẩm trực tiếp từ Server
  const categories = getAllCategories();
  const allProducts = await getAllProducts(); // Nếu hàm này không cần await thì bạn có thể bỏ chữ await đi nhé

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <Hero />
      
      {/* Truyền dữ liệu trực tiếp vào component đã sửa */}
      <CategorySection categories={categories} allProducts={allProducts} />
      
      <Features />
      <CTASection />
      <NewsSection />
      <ContactCTA />
    </>
  );
}
