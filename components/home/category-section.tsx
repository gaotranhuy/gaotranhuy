'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Category, Product } from '@/types';

interface CategorySectionProps {
  categories: Category[];
  allProducts: Product[];
}

export function CategorySection({ categories, allProducts }: CategorySectionProps) {
  const [isInsideFeatured, setIsInsideFeatured] = React.useState(false);

  React.useEffect(() => {
    let featuredTop = 0;
    let featuredBottom = 0;

    // Hàm tính toán vị trí chuẩn xác dựa vào ID cố định
    const updateCoordinates = () => {
      const featuredSection = document.getElementById('featured-section');
      if (featuredSection) {
        const rect = featuredSection.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        featuredTop = rect.top + scrollTop;
        featuredBottom = rect.bottom + scrollTop;
      }
    };

    // Chạy tính toán vị trí ngay khi vào trang và khi đổi kích thước màn hình
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);

    let isTicking = false;

    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          // Mốc kích hoạt đụng trần header (85px cho desktop, 69px cho mobile)
          const scrollPos = (window.scrollY || document.documentElement.scrollTop) + (window.innerWidth >= 1024 ? 85 : 69);

          // Nếu vị trí cuộn nằm trọn trong vùng ID "featured-section"
          if (featuredTop > 0 && scrollPos >= featuredTop && scrollPos <= featuredBottom) {
            setIsInsideFeatured(true);
          } else {
            setIsInsideFeatured(false);
          }
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Thêm một chút thời gian chờ (timeout) nhỏ để đảm bảo Next.js đã render xong HTML rồi mới đo vị trí
    const timer = setTimeout(updateCoordinates, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCoordinates);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section 
      className={`sticky top-16 lg:top-20 z-30 w-full py-3 border-b border-border/40 backdrop-blur transition-colors duration-300 ${
        isInsideFeatured 
          ? 'bg-[#f4f4f5]/90 dark:bg-[#27272a]/90' // Màu nền xám trùng khít với bg-accent/30 khi cuộn tới
          : 'bg-background/95' // Màu trắng mặc định ban đầu
      }`}
    >
      <div className="container-page">
        {/* Thanh danh mục cuộn ngang tối giản */}
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
