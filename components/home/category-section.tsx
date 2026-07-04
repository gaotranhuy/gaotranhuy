import Link from 'next/link';
import { getAllCategories } from '@/lib/supabase-data';

export async function CategorySection() {
  const categories = getAllCategories();

  return (
    // 1. Cấu hình "top-16" cho mobile và "lg:top-20" cho desktop để vừa khít với chiều cao của Header.
    // z-30 đảm bảo đè lên nội dung trang nhưng nằm dưới Header (Header đang là z-40).
    <section className="sticky top-16 lg:top-20 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 border-b border-border/40 transition-all">
      <div className="container-page">
        {/* Thanh danh mục cuộn ngang, ẩn thanh cuộn scrollbar trên mọi thiết bị */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Nút "Tất cả" - mặc định nổi bật */}
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all whitespace-nowrap hover:bg-primary/90 shadow-sm"
          >
            Tất cả
          </Link>
          
          {/* Danh sách 6 danh mục gọn nhẹ dạng nút nhỏ */}
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/danh-muc/${cat.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-border bg-muted/50 px-5 py-2 text-sm font-medium text-foreground/80 transition-all whitespace-nowrap hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
