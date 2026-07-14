'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/cart-context';
import { formatPrice, calculateDiscount, formatNumber } from '@/lib/format';
import { getCategoryBySlug } from '@/lib/products';
import { toast } from 'sonner';
import type { Product } from '@/types';

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);
  const [addedFeedback, setAddedFeedback] = React.useState(false);
  const category = getCategoryBySlug(product.categorySlug);
  const discount = calculateDiscount(product.price, product.oldPrice);

  const rawGallery = product.gallery?.length
    ? [product.image, ...product.gallery]
    : [product.image];

  const gallery = Array.from(new Set(rawGallery.filter(Boolean)));

  const touchStartX = React.useRef<number>(0);
  const touchEndX = React.useRef<number>(0);

  const handleAddToCart = () => {
    addItem(product, quantity, { silent: true });
    toast.success('Đã thêm vào giỏ hàng');
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, { silent: true });
    window.location.href = '/gio-hang';
  };

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current && touchEndX.current) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) handleNextImage();
        else handlePrevImage();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
      {/* Gallery Section */}
      <div className="flex flex-col gap-3">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted/40"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={gallery[activeImage]}
            alt={product.name}
            fill
            priority={activeImage === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-md transition-transform hover:scale-110 active:scale-95"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur shadow-md transition-transform hover:scale-110 active:scale-95"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails - responsive: scrollable on mobile, wrap on desktop */}
        {gallery.length > 1 && (
          <div className="flex flex-wrap gap-2 py-1">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square h-14 w-14 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-card transition-all duration-300 ${
                  activeImage === i
                    ? 'border-primary scale-95 shadow-sm opacity-100'
                    : 'border-border/60 opacity-60 hover:border-primary/40 hover:opacity-90'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} hình ${i + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 56px, 80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col w-full min-w-0 overflow-hidden">
        {category && (
          <Link
            href={`/danh-muc/${category.slug}`}
            className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15"
          >
            {category.name}
          </Link>
        )}

        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl break-words">
          {product.name}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed break-words">
          {product.shortDescription}
        </p>

        {/* Rating + sold */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-1 text-sm font-bold text-amber-600 dark:text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({formatNumber(product.reviewCount)} đánh giá)
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">
            Đã bán {formatNumber(product.soldCount)}
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold text-primary sm:text-4xl">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            /{product.unit}
          </span>
          {product.oldPrice && (
            <span className="text-base text-muted-foreground/60 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {discount && (
            <Badge className="bg-rose-500 text-white">-{discount}%</Badge>
          )}
        </div>

        {/* Origin & weight */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {product.origin && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {product.origin}
            </div>
          )}
          {product.weight && (
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {product.weight}
            </div>
          )}
        </div>

        <Separator className="my-5" />

        {/* Quantity + Add to cart */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Số lượng:</span>
            <div className="flex items-center gap-1 rounded-lg border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-50"
                disabled={quantity <= 1}
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-base font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-primary"
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 mt-1 w-full">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full h-12 rounded-xl text-sm font-semibold tracking-wide shadow-md active:scale-98 transition-all duration-300 sm:col-span-1 ${
                addedFeedback
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : ''
              }`}
            >
              {addedFeedback ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5 animate-in zoom-in-50 duration-200" />
                  Đã thêm vào giỏ!
                </>
              ) : (
                <>
                  <ShoppingBag className={`h-4 w-4 mr-1.5 transition-transform ${addedFeedback ? 'scale-150' : ''}`} />
                  {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng tạm thời'}
                </>
              )}
            </Button>

            <Button
              size="lg"
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full h-12 rounded-xl text-sm font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-md active:scale-98 transition-transform sm:col-span-1"
            >
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              Mua hàng ngay
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-muted pt-5 w-full">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-xs text-muted-foreground">Giao hàng nhanh</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-xs text-muted-foreground">Chính hãng 100%</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <RotateCcw className="h-4 w-4" />
            </div>
            <span className="text-xs text-muted-foreground">Đổi trả dễ dàng</span>
          </div>
        </div>
      </div>

      {/* Tabs section - full width */}
      <div className="lg:col-span-2 mt-6">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="features">Đặc điểm</TabsTrigger>
            {product.nutritionFacts && product.nutritionFacts.length > 0 && (
              <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {product.description || product.shortDescription}
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-4">
            {product.features.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có thông tin</p>
            )}
          </TabsContent>

          {product.nutritionFacts && product.nutritionFacts.length > 0 && (
            <TabsContent value="nutrition" className="mt-4">
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold">Thành phần</th>
                      <th className="px-4 py-2.5 text-right font-semibold">Giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.nutritionFacts.map((fact, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2.5 text-muted-foreground">{fact.label}</td>
                        <td className="px-4 py-2.5 text-right font-medium">{fact.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
