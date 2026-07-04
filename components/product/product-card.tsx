'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AddToCartButton } from './add-to-cart-button';
import { formatPrice, calculateDiscount, formatNumber } from '@/lib/format';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const discount = calculateDiscount(product.price, product.oldPrice);

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30">
      
      {/* 1. Khung ảnh sản phẩm chuẩn tỷ lệ 1:1 */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted/40"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Nhãn Badges góc trái */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-medium text-[10px] px-2 py-0.5 rounded-md shadow-sm border-none">
              <Zap className="mr-0.5 h-3 w-3 fill-current inline" />
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
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Lớp phủ sang trọng khi tạm hết hàng */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-neutral-900/90 dark:bg-neutral-100/90 px-3.5 py-1.5 text-xs font-semibold text-neutral-50 dark:text-neutral-900 shadow-md">
              Tạm hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* 2. Phần thông tin chữ */}
      <div className="flex flex-1 flex-col p-4">
        
        {/* ĐÃ SỬA TẠI ĐÂY: Bỏ hoàn toàn Link danh mục cũ, chỉ giữ lại nơi xuất xứ đẩy sát sang góc phải */}
        <div className="flex items-center justify-end gap-2 mb-1.5 text-[11px] font-medium text-muted-foreground/60">
          <div className="flex items-center gap-0.5 shrink-0">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[120px]">{product.origin}</span>
          </div>
        </div>

        {/* Tên sản phẩm thoáng đãng */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold tracking-tight text-foreground leading-snug min-h-[40px] transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        {/* Đánh giá & Số lượng đã bán */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground border-b border-muted pb-3">
          <div className="flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-600 dark:text-amber-400 font-bold shrink-0">
            <Star className="h-3 w-3 fill-current" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="font-medium">({formatNumber(product.reviewCount)})</span>
          <span className="mx-0.5 text-muted-foreground/30">|</span>
          <span className="font-medium text-foreground/70">
            Đã bán {formatNumber(product.soldCount)}
          </span>
        </div>

        {/* 3. Khu vực Giá cả và Nút Giỏ Hàng hàng ngang */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col min-h-[40px] justify-center">
            <div className="flex items-baseline gap-0.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                /{product.unit}
              </span>
            </div>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground/60 line-through tracking-tight">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Gọi nút mua dạng vuông icon siêu nghệ thuật */}
          <div className="shrink-0">
            <AddToCartButton
              product={product}
              size="icon"
              className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/10 active:scale-95 transition-transform"
            />
          </div>
        </div>

      </div>
    </Card>
  );
}
