'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Category, Product } from '@/types';

interface CategorySectionProps {
  categories: Category[];
  allProducts: Product[];
}

export function CategorySection({ categories, allProducts }: CategorySectionProps) {
  const [dynamicBg, setDynamicBg] = React.useState('bg-background/95');

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let currentBg = 'bg-background/95 backdrop-blur';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        
        // Kiểm tra xem vị trí cuộn có đang giao thoa với vùng "Sản phẩm nổi bật"
        // (Do Header cao h-16 trên mobile và h-20 trên desktop nên ta căn mốc 80px)
        if (rect.top <= 80 && rect.bottom >= 80) {
          if (section.innerHTML.includes('Sản phẩm nổi bật')) {
            // Đổi sang màu xám/kem trùng khít với bg-accent/30 của khu vực nổi bật
            currentBg = 'bg-[#f4f4f5]/90 backdrop-blur dark:bg-[#27272a]/90'; 
          }
        }
      });

      setDynamicBg(currentBg);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Chạy kiểm tra ngay khi load trang

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      className={`sticky top-16 lg:top-20 z-30 w-full py-3 border-b border-border/40 transition-colors duration-300 ${dynamicBg}`}
    >
      <div className="container-page">
        {/* Thanh danh mục cuộn ngang tối giản, ẩn hoàn toàn thanh scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Nút "Tất cả" */}
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all whitespace-nowrap hover:bg-primary/90 shadow-sm"
          >
            Tất cả
          </Link>
          
          {/* 6 nút danh mục nhỏ gọn nằm ngang */}
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
