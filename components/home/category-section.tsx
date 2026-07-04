'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Category, Product } from '@/types';

interface CategorySectionProps {
  categories: Category[];
  allProducts: Product[];
}

export function CategorySection({ categories, allProducts }: CategorySectionProps) {
  return (
    <section 
      /* 
        BÍ QUYẾT Ở ĐÂY: 
        - bg-transparent: Ép nền trong suốt để màu của khu vực bên dưới tự lộ ra khi cuộn qua.
        - backdrop-blur-md: Làm mờ hậu cảnh để chữ và nút không bị rối mắt khi đè lên sản phẩm.
        - bg-background/40: Thêm một lớp phủ siêu mỏng để giữ độ tương phản tốt trên mọi nền màu.
      */
      className="sticky top-16 lg:top-20 z-30 w-full py-3 border-b border-border/40 bg-background/40 backdrop-blur-md transition-all duration-300"
    >
      <div className="container-page">
        {/* Thanh danh mục cuộn ngang tối giản */}
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
              className="inline-flex items-center justify-center rounded-full border border-border bg-background/80 px-5 py-2 text-sm font-medium text-foreground/80 transition-all whitespace-nowrap hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
