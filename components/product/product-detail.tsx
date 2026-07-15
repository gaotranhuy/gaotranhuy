'use client';

import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/cart-context';
import { formatPrice, calculateDiscount, formatNumber } from '@/lib/format';
import { getCategoryBySlug } from '@/lib/products';
import { CloudinaryImage } from '@/components/common/cloudinary-image';
import { toast } from 'sonner';
import type { Product } from '@/types';

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);
  const [addedFeedback, setAddedFeedback] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  
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

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNextImage();
      else handlePrevImage();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Gallery */}
      <div className="space-y-4">
        <div
          className="relative aspect-square overflow-hidden rounded-2xl border bg-muted"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <CloudinaryImage
            src={gallery[activeImage]}
            alt={product.name}
            size="product"
            priority
            className="object-cover"
          />
          {gallery.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur transition-colors hover:bg-background"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur transition-colors hover:bg-background"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === activeImage
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-border'
                }`}
              >
                <CloudinaryImage
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  size="thumbnail"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-6">
        <div>
          {category && (
            <Link
              href={`/danh-muc/${category.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="font-bold">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">({formatNumber(product.reviewCount)} đánh giá)</span>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-muted-foreground">Đã bán {formatNumber(product.soldCount)}</span>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <span className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">/{product.unit}</span>
          {product.oldPrice && (
            <span className="mb-1 text-base text-muted-foreground/60 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {discount && (
            <Badge className="mb-1.5 bg-rose-500 hover:bg-rose-500 text-white font-semibold">
              -{discount}%
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Xuất xứ: {product.origin}</span>
        </div>

        <Separator />

        {/* Quantity & Add to cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Số lượng:</span>
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                aria-label="Giảm"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-base font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                aria-label="Tăng"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 gap-2">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 gap-2"
              variant={addedFeedback ? 'secondary' : 'default'}
            >
              {addedFeedback ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Đã thêm!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  Thêm vào giỏ
                </>
              )}
            </Button>
            <Button
              onClick={handleBuyNow}
              size="lg"
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              Mua ngay
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3 rounded-xl border bg-card p-4">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">Cam kết chất lượng</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">Giao hàng nhanh</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <RotateCcw className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">Đổi trả dễ dàng</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            {product.nutritionFacts && product.nutritionFacts.length > 0 && (
              <TabsTrigger value="nutrition">Dinh dưỡng</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className={`prose prose-sm max-w-none text-foreground/80 ${!isExpanded ? 'line-clamp-4' : ''}`}>
              <ReactMarkdown>{product.description || ''}</ReactMarkdown>
            </div>
            {product.description && product.description.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {isExpanded ? (
                  <>
                    Thu gọn <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Xem thêm <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
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
