'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Category, Product } from '@/types';

interface CategorySectionProps {
  categories: Category[];
  allProducts: Product[];
}

export function CategorySection({ categories, allProducts }: CategorySectionProps) {
  // Quản lý class màu bằng state, mặc định là màu trắng đặc bg-background
  const [currentBgClass, setCurrentBgClass] = React.useState('bg-background');

  React.useEffect(() => {
    const handleScroll = () => {
      // 1. Tìm trực tiếp phần tử Sản phẩm nổi bật bằng ID ta đã thêm lúc nãy
      const featuredSection = document.getElementById('featured-section');
      if (!featuredSection) return;

      // 2. Lấy vị trí cuộn hiện tại của toàn trang
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // 3. Tính toán vị trí tuyệt đối của vùng nổi bật so với đỉnh trang web
      const rect = featuredSection.getBoundingClientRect();
      const featuredAbsoluteTop = rect.top + scrollTop;
      const featuredAbsoluteBottom = rect.bottom + scrollTop;

      // Mốc kích hoạt khi thanh danh mục chạm vào vùng nổi bật (trừ đi độ cao header khoảng 64px - 80px)
      const triggerOffset = window.innerWidth >= 1024 ? 80 : 64;
      const currentScrollPosition = scrollTop + triggerOffset;

      // 4. Nếu vị trí cuộn hiện tại nằm TRONG phạm vi của Sản phẩm nổi bật
      if (currentScrollPosition >= featuredAbsoluteTop && currentScrollPosition <= featuredAbsoluteBottom) {
        // Đổi sang màu xám đặc (áp màu nền y hệt bg-accent/30 của anh)
        setCurrentBgClass('bg-[#f4f4f5] dark:bg-[#27272a]'); 
      } else {
        // Trở về màu trắng đặc mặc định ban đầu
        setCurrentBgClass('bg-background');
      }
    };

    // Lắng nghe sự kiện cuộn chuột với passive để không ảnh hưởng điểm tải trang
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Chạy kiểm tra ngay lập tức khi vừa load xong trang
    handleScroll();

    // Tính toán lại nếu người dùng co giãn màn hình (xoay điện thoại)
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section 
      // transition-colors giúp hiệu ứng đổi từ màu trắng sang xám diễn ra êm ái trong 300ms
      className={`sticky top-16 lg:top-20 z-35 w-full py-3 border-b border-border/40 transition-colors duration-300 ${currentBgClass}`}
    >
      <div className="container-page">
        {/* Thanh danh mục cuộn ngang tối giản, ẩn thanh scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all whitespace-nowrap hover:bg-primary/90 shadow-sm"
          >
            Tất cả
          </Link>
          
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
