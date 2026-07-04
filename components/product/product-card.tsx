'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Zap, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AddToCartButton } from './add-to-cart-button';
import { formatPrice, calculateDiscount, formatNumber } from '@/lib/format';
import { getCategoryBySlug } from '@/lib/products';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const category = getCategoryBySlug(product.categorySlug);
  const discount = calculateDiscount(product.price, product.oldPrice);

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30">
      
      {/* 1. Khung Ảnh Sản Phẩm với Tỷ Lệ Chuẩn */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block aspect-[4/4] overflow-hidden bg-muted/40"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Nhãn Badges bo góc tinh tế, chuyển màu dịu mắt hơn */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-medium text-[10px] px-2 py-0.5 rounded-md shadow-sm border-none backdrop-blur-sm">
              <Zap className="mr-0.5 h-3 w-3 fill-current" />
              Bán chạy
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-medium text-[10px] px-2 py-0.5 rounded-md shadow-sm border-none">
              Mới về
            </Badge>
          )}
          {discount && (
            <Badge className="bg-rose-500 hover:bg-rose-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-sm border-none">
              Tiết kiệm {discount}%
            </Badge>
          )}
        </div>

        {/* Lớp phủ khi hết hàng cao cấp */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px] transition-all duration-300">
            <span className="rounded-full bg-neutral-900/90 dark:bg-neutral-100/90 px-3.5 py-1.5 text-xs font-semibold text-neutral-50 dark:text-neutral-900 shadow-md">
              Hết hàng tạm thời
            </span>
          </div>
        )}
      </Link>

      {/* 2. Phần Nội Dung Thông Tin */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        
        {/* Danh mục & Xuất xứ gộp chung hàng tối ưu không gian */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-medium text-muted-foreground/80">
          {category ? (
            <Link
              href={`/danh-muc/${category.slug}`}
              className="text-primary hover:text-primary/80 transition-colors truncate max-w-[120px]"
            >
              {category.name}
            </Link>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-0.5 shrink-0">
            <MapPin className="h-3 w-3 text-muted-foreground/60" />
            <span className="truncate max-w-[90px]">{product.origin}</span>
          </div>
        </div>

        {/* Tên sản phẩm - tăng khoảng cách dòng line-height để dễ đọc */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold tracking-tight text-foreground leading-snug min-h-[40px] transition-colors hover:text-primary"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Đánh giá & Số lượng đã bán dạng Modern Minimalist */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground border-b border-muted pb-3">
          <div className="flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-600 dark:text-amber-400 font-bold shrink-0">
            <Star className="h-3 w-3 fill-current" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="font-medium">({formatNumber(product.reviewCount)})</span>
          <span className="mx-0.5 text-muted-foreground/40">|</span>
          <span className="font-medium text-foreground/70">
            Đã bán {formatNumber(product.soldCount)}
          </span>
        </div>

        {/* 3. Khu Vực Giá Tiền & Nút Mua Hàng */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col min-h-[44px] justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold tracking-tight text-primary">
                {formatPrice(product.price)}
              </span>
              {/* Lồng đơn vị tính sát giá tiền để tăng trải nghiệm đọc hiểu */}
              <span className="text-[11px] font-medium text-muted-foreground">
                /{product.unit}
              </span>
            </div>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground/70 line-through tracking-tight">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Nút giỏ hàng bo tròn biểu tượng cao cấp, phản hồi mượt mà */}
          <div className="shrink-0">
            <AddToCartButton
              product={product}
              size="icon"
              className={cn(
                "h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-200 active:scale-95",
                !product.inStock && "opacity-50 pointer-events-none"
              )}
              label={
                <span className="sr-only">Thêm vào giỏ</span>
              }
              icon={<ShoppingBag className="h-4 w-4" />}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
