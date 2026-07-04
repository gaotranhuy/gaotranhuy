'use client';

import * as React from 'react';
import { ProductGrid } from '@/components/product/product-grid';
import type { Product } from '@/types';

// Định nghĩa interface cho Category đồng bộ với dữ liệu Supabase của bạn
interface Category {
  name: string;
  slug: string;
}

interface CategorySectionProps {
  categories: Category[];
  allProducts: Product[];
}

export function CategorySection({ categories, allProducts }: CategorySectionProps) {
  // Trạng thái lưu danh mục đang chọn, mặc định ban đầu là 'tat-ca'
  const [selectedCategory, setSelectedCategory] = React.useState<string>('tat-ca');

  // Lọc sản phẩm theo danh mục đang active bằng useMemo để tối ưu hiệu năng giống FeaturedProducts
  const products = React.useMemo(() => {
    if (selectedCategory === 'tat-ca') return allProducts;
    return allProducts.filter((product) => product.categorySlug === selectedCategory);
  }, [selectedCategory, allProducts]);

  return (
    <section className="py-6 bg-background">
      <div className="container-page">
        
        {/* 1. Chỉ giữ lại chữ Danh mục nhỏ gọn ở góc trên cùng */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Danh mục
          </span>
        </div>

        {/* 2. Thanh cuộn ngang Horizontal Pill Tabs siêu mượt */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Nút Tất cả */}
          <button
            onClick={() => setSelectedCategory('tat-ca')}
            className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap shadow-sm ${
              selectedCategory === 'tat-ca'
                ? 'bg-primary text-primary-foreground shadow'
                : 'border border-border bg-muted/50 text-foreground/80 hover:border-primary hover:text-primary'
            }`}
          >
            Tất cả
          </button>
          
          {/* 6 danh mục nút nhỏ tối giản */}
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'border border-border bg-muted/50 text-foreground/80 hover:border-primary hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 3. Khu vực hiển thị sản phẩm sử dụng lại ProductGrid chuẩn của bạn */}
        <div className="mt-8">
          {products.length > 0 ? (
            <ProductGrid products={products} columns={4} />
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Hiện chưa có sản phẩm nào thuộc danh mục này.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
