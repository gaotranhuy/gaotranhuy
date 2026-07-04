'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categorySlug: string;
  slug: string; // Đảm bảo dữ liệu sản phẩm có slug để làm đường dẫn url
}

interface CategorySectionProps {
  categories: Category[];
  allProducts: Product[];
}

export function CategorySection({ categories, allProducts }: CategorySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('tat-ca');

  const filteredProducts = selectedCategory === 'tat-ca'
    ? allProducts
    : allProducts.filter(product => product.categorySlug === selectedCategory);

  return (
    <section className="py-6 bg-background">
      <div className="container-page">
        
        {/* Chữ Danh mục nhỏ gọn ở trên cùng */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Danh mục
          </span>
        </div>

        {/* Thanh cuộn ngang Horizontal Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setSelectedCategory('tat-ca')}
            className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap shadow-sm ${
              selectedCategory === 'tat-ca'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-muted/50 text-foreground/80 hover:border-primary hover:text-primary'
            }`}
          >
            Tất cả
          </button>
          
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-muted/50 text-foreground/80 hover:border-primary hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Khu vực danh sách sản phẩm */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col overflow-hidden rounded-xl border bg-card p-3 shadow-sm transition-all hover:shadow-md"
            >
              {/* SỬA LỖI 1 & 2: Bọc toàn bộ phần ảnh và tên vào Link để bấm được, đổi sang Next/Image fill ô chứa */}
              <Link href={`/san-pham/${product.slug}`} className="block flex-1">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="mt-3 flex flex-col">
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">kg</p>
                </div>
              </Link>
              
              {/* Phần giá tiền và nút mua (Nút mua không bọc trong Link để tránh bị xung đột sự kiện click) */}
              <div className="mt-2 flex items-center justify-between gap-2 data-no-link">
                <span className="text-sm font-semibold text-foreground">
                  {product.price.toLocaleString('vi-VN')} đ
                </span>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
              Hiện chưa có sản phẩm nào thuộc danh mục này.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
