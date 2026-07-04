'use client';

import * as React from 'react';
import Link from 'next/link';

interface Category {
  name: string;
  slug: string;
}

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  // Trạng thái lưu class màu nền động, mặc định ban đầu là bg-background
  const [dynamicBg, setDynamicBg] = React.useState('bg-background/95');

  React.useEffect(() => {
    // Hàm kiểm tra và cập nhật màu nền dựa trên vị trí cuộn
    const handleScroll = () => {
      // Tìm phần tử "Sản phẩm nổi bật" trên trang dựa vào tiêu đề hoặc cấu trúc của nó
      // Thường SectionHeading của Sản phẩm nổi bật có title="Sản phẩm nổi bật"
      const sections = document.querySelectorAll('section');
      let currentBg = 'bg-background/95 backdrop-blur';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        
        // Nếu section đó đang nằm trong vùng hiển thị (đụng trần header khoảng top-16/top-20)
        // và nội dung của nó có chứa chữ "Sản phẩm nổi bật"
        if (rect.top <= 80 && rect.bottom >= 80) {
          if (section.innerHTML.includes('Sản phẩm nổi bật')) {
            // Trùng khít với màu nền bg-accent/30 của Sản phẩm nổi bật nhưng thêm hiệu ứng mờ backdrop
            currentBg = 'bg-[#f4f4f5]/90 backdrop-blur dark:bg-[#27272a]/90'; 
          }
        }
      });

      setDynamicBg(currentBg);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Chạy kiểm tra ngay lần đầu tiên tải trang
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Sử dụng biến dynamicBg để thay đổi màu sắc mượt mà qua transition-colors
    <section 
      className={`sticky top-16 lg:top-20 z-30 w-full py-3 border-b border-border/40 transition-colors duration-300 ${dynamicBg}`}
    >
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
          
          {/* Danh sách danh mục gọn nhẹ */}
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/danh-muc/${cat.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 px-5 py-2 text-sm font-medium text-foreground/80 transition-all whitespace-nowrap hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
