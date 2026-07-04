'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Category, Product } from '@/types';

interface CategorySectionProps {
  categories: Category[];
  allProducts: Product[];
}

export function CategorySection({ categories, allProducts }: CategorySectionProps) {
  // Chuyển về dùng class Tailwind thay vì inline style style để trình duyệt render bằng GPU
  const [isInsideFeatured, setIsInsideFeatured] = React.useState(false);

  React.useEffect(() => {
    // Biến lưu vị trí (top, bottom) của vùng Sản phẩm nổi bật để không phải tính lại liên tục
    let featuredTop = 0;
    let featuredBottom = 0;

    // Hàm cập nhật tọa độ thực tế của vùng Sản phẩm nổi bật
    const updateCoordinates = () => {
      const sections = document.querySelectorAll('section, main > div');
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].innerHTML.includes('Sản phẩm nổi bật')) {
          const rect = sections[i].getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          featuredTop = rect.top + scrollTop;
          featuredBottom = rect.bottom + scrollTop;
          break;
        }
      }
    };

    // Chạy ngay lần đầu và tính lại khi đổi kích thước màn hình
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);

    // Sử dụng cơ chế khóa khung hình (Tối ưu hiệu năng cuộn)
    let isTicking = false;

    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const scrollPos = (window.scrollY || document.documentElement.scrollTop) + (window.innerWidth >= 1024 ? 85 : 69);

          // Kiểm tra xem vị trí cuộn hiện tại có nằm trong vùng Sản phẩm nổi bật không
          if (scrollPos >= featuredTop && scrollPos <= featuredBottom) {
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
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCoordinates);
    };
  }, []);

  return (
    <section 
      className={`sticky top-16 lg:top-20 z-30 w-full py-3 border-b border-border/40 backdrop-blur transition-colors duration-300 ${
        isInsideFeatured 
          ? 'bg-[#f4f4f5]/90 dark:bg-[#27272a]/90' 
          : 'bg-background/95'
      }`}
    >
      <div className="container-page">
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
