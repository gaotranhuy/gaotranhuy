'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Package,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/cart-context';
import { formatPrice, calculateDiscount, formatNumber } from '@/lib/format';
import { getCategoryBySlug } from '@/lib/products';
import { contactInfo } from '@/data/site';
import type { Product } from '@/types';

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);
  const category = getCategoryBySlug(product.categorySlug);
  const discount = calculateDiscount(product.price, product.oldPrice);
  const gallery = product.gallery?.length ? product.gallery : [product.image];

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const zaloOrderUrl = `https://zalo.me/${contactInfo.zalo}?message=${encodeURIComponent(
    `Tôi muốn đặt: ${product.name} - SL: ${quantity} - ${formatPrice(
      product.price * quantity
    )}`
  )}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Gallery */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
          <Image
            src={gallery[activeImage]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {discount && (
            <Badge className="absolute left-4 top-4 bg-destructive text-destructive-foreground shadow">
              -{discount}%
            </Badge>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  activeImage === i
                    ? 'border-primary'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        {category && (
          <Link
            href={`/danh-muc/${category.slug}`}
            className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15"
          >
            {category.name}
          </Link>
        )}

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {product.name}
        </h1>

        <p className="mt-3 text-base text-muted-foreground">
          {product.shortDescription}
        </p>

        {/* Rating + sold */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-warning text-warning'
                      : 'fill-muted text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({formatNumber(product.reviewCount)} đánh giá)
            </span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground">
            Đã bán {formatNumber(product.soldCount)}
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-end gap-3 rounded-2xl bg-accent/40 p-5">
          <span className="text-3xl font-extrabold text-primary sm:text-4xl">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {discount && (
            <Badge className="mb-1 bg-destructive text-destructive-foreground">
              Tiết kiệm {discount}%
            </Badge>
          )}
          <span className="ml-auto text-sm text-muted-foreground">
            / {product.unit}
          </span>
        </div>

        {/* Quick info */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Xuất xứ</div>
              <div className="text-sm font-medium">{product.origin}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Package className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Quy cách</div>
              <div className="text-sm font-medium">{product.weight}</div>
            </div>
          </div>
        </div>

        {/* Quantity + actions */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Số lượng:</span>
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                aria-label="Giảm"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-base font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                aria-label="Tăng"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              Tổng: <span className="font-semibold text-foreground">{formatPrice(product.price * quantity)}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full"
            >
              <ShoppingBag className="h-5 w-5" />
              {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full">
              <a href={zaloOrderUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Đặt qua Zalo
              </a>
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t pt-5">
          <div className="flex flex-col items-center gap-1 text-center">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Giao hàng toàn quốc</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Cam kết chất lượng</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <RotateCcw className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">Đổi trả 24h</span>
          </div>
        </div>
      </div>

      {/* Tabs: description, features, nutrition */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="features">Đặc điểm</TabsTrigger>
            {product.nutritionFacts && (
              <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
            )}
          </TabsList>
          <TabsContent
            value="description"
            className="prose prose-sm max-w-none rounded-xl border p-5"
          >
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
              {product.description}
            </p>
          </TabsContent>
          <TabsContent
            value="features"
            className="rounded-xl border p-5"
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          {product.nutritionFacts && (
            <TabsContent value="nutrition" className="rounded-xl border p-5">
              <table className="w-full text-sm">
                <tbody>
                  {product.nutritionFacts.map((fact, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2.5 font-medium text-foreground/80">
                        {fact.label}
                      </td>
                      <td className="py-2.5 text-right font-semibold">
                        {fact.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
