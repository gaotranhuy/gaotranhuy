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
    // 1. Tìm phần tử ID "featured-section" mà ta đã đặt ở bước trước
    const target = document.getElementById('featured-section');
    if (!target) return;

    // 2. Observer sẽ báo hiệu ngay khi vùng "Sản phẩm nổi bật" chạm vào thanh Sticky
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting = true nghĩa là phần nổi bật đang "chạm" hoặc nằm dưới thanh sticky
        setIsInsideFeatured(entry.isIntersecting);
      },
      {
        // rootMargin: '-85px 0px 0px 0px' 
        // Số -85px này để trừ đi chiều cao của Header + Thanh danh mục 
        // Khi vùng sản phẩm nổi bật lướt lên tới vị trí này, nó sẽ kích hoạt
        rootMargin: '-85px 0px 0px 0px', 
        threshold: 0
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className={`sticky top-16 lg:top-20 z-30 w-full py-3 border-b border-border/40 backdrop-blur transition-colors duration-300 ${
        isInsideFeatured 
          ? 'bg-[#f4f4f5]/90 dark:bg-[#27272a]/90' // Màu nền trùng với bg-accent/30
          : 'bg-background/95' // Màu nền trắng mặc định
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
