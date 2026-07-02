'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Zap } from 'lucide-react';
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
    <Card className="group relative flex flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isBestSeller && (
            <Badge className="bg-warning text-warning-foreground shadow-sm">
              <Zap className="mr-1 h-3 w-3" />
              Bán chạy
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-success text-success-foreground shadow-sm">
              Mới
            </Badge>
          )}
          {discount && (
            <Badge className="bg-destructive text-destructive-foreground shadow-sm">
              -{discount}%
            </Badge>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background">
              Tạm hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {category && (
          <Link
            href={`/danh-muc/${category.slug}`}
            className="mb-1 text-xs font-medium text-primary hover:underline"
          >
            {category.name}
          </Link>
        )}
        <Link
          href={`/san-pham/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {product.origin}
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="text-xs font-semibold">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({formatNumber(product.reviewCount)})
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            Đã bán {formatNumber(product.soldCount)}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{product.unit}</span>
        </div>

        {/* Add to cart */}
        <div className="mt-3">
          <AddToCartButton
            product={product}
            size="sm"
            className="w-full"
            label="Thêm vào giỏ"
          />
        </div>
      </div>
    </Card>
  );
}
