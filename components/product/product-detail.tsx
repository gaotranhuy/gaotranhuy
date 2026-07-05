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
  ChevronLeft,
  ChevronRight,
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

  // Khai báo biến tạm dùng để lưu tọa độ điểm chạm ngón tay ban đầu
  const touchStartX = React.useRef<number>(0);
  const touchEndX = React.useRef<number>(0);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  /* ===========================================================================
    CẢI TIẾN THÊM LOGIC CẢM ỨNG (SWIPE GESTURES):
    - handleTouchStart: Ghi lại vị trí ngón tay vừa chạm vào màn hình.
    - handleTouchEnd: Ghi lại vị trí ngón tay nhấc lên, so sánh khoảng cách 
      để xác định xem người dùng vuốt sang trái hay sang phải.
    ===========================================================================
  */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    // Nếu khoảng cách di chuyển quá ngắn (dưới 50px), coi như là chạm nhầm (tap) và bỏ qua
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeThreshold = Math.abs(distance) > 50;

    if (isSwipeThreshold) {
      if (distance > 0) {
        // Vuốt từ phải sang trái -> Xem ảnh kế tiếp
        handleNextImage();
      } else {
        // Vuốt từ trái sang phải -> Quay lại ảnh trước
        handlePrevImage();
      }
    }

    // Reset lại tọa độ sau khi vuốt xong
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const zaloOrderUrl = `https://zalo.me/${contactInfo.zalo}?message=${encodeURIComponent(
    `Tôi muốn đặt: ${product.name} - SL: ${quantity} - ${formatPrice(
      product.price * quantity
    )}`
  )}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 w-full max-w-full overflow-x-hidden px-4 sm:px-0 box-border">
      
      {/* ================= KHU VỰC GALLERY: ĐÃ THÊM TÍNH NĂNG VUỐT ẢNH ================= */}
      <div className="flex flex-col gap-3 w-full min-w-0 overflow-hidden">
        {/* Khung ảnh bự ở trên:
          Gắn thêm 3 sự kiện cảm ứng (onTouchStart, onTouchMove, onTouchEnd) 
          giúp nhận diện thao tác vuốt lướt trên điện thoại một cách hoàn hảo.
        */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-sm cursor-grab active:cursor-grabbing select-none"
        >
          <Image
            src={gallery[activeImage]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-all duration-500 pointer-events-none"
            priority
          />
          
          {discount && (
            <Badge className="absolute left-4 top-4 bg-rose-500 text-white font-semibold shadow-sm border-none z-10">
              Tiết kiệm {discount}%
            </Badge>
          )}

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                aria-label="Ảnh tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Hàng ảnh nhỏ ở dưới */}
        {gallery.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 w-full max-w-full scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  sizes="(max-width: 640px) 56px, 80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= KHU VỰC THÔNG TIN SẢN PHẨM ================= */}
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
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-muted pb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
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
            <span className="text-sm font-bold">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({formatNumber(product.reviewCount)} đánh giá)
            </span>
          </div>
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <span className="text-sm text-muted-foreground">
            Đã bán {formatNumber(product.soldCount)} sản phẩm
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex flex-wrap items-baseline gap-2 rounded-2xl bg-accent/20 px-4 py-3.5 sm:px-5 sm:py-4">
          <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm sm:text-base text-muted-foreground line-through tracking-tight">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-sm font-medium text-muted-foreground ml-1">
            / {product.unit}
          </span>
        </div>

        {/* Quick info */}
        <div className="mt-5 grid grid-cols-2 gap-3 w-full">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 p-2.5 sm:p-3 bg-card min-w-0">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] text-muted-foreground">Xuất xứ</div>
              <div className="text-xs sm:text-sm font-semibold text-foreground truncate">{product.origin}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/60 p-2.5 sm:p-3 bg-card min-w-0">
            <Package className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] text-muted-foreground">Quy cách</div>
              <div className="text-xs sm:text-sm font-semibold text-foreground truncate">{product.weight}</div>
            </div>
          </div>
        </div>

        {/* Quantity + actions */}
        <div className="mt-6 flex flex-col gap-4 border-t pt-5 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground shrink-0">Số lượng:</span>
              <div className="flex items-center rounded-xl border border-border/80 bg-background overflow-hidden h-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-primary active:scale-95"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-primary active:scale-95"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Thành tiền: <span className="text-lg font-bold text-foreground ml-1">{formatPrice(product.price * quantity)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 mt-1 w-full">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full h-12 rounded-xl text-sm font-semibold tracking-wide shadow-md active:scale-98 transition-transform"
            >
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng tạm thời'}
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full h-12 rounded-xl text-sm font-semibold tracking-wide border-primary text-primary hover:bg-primary/5 active:scale-98 transition-transform">
              <a href={zaloOrderUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-1.5 fill-current" />
                Đặt hàng nhanh qua Zalo
              </a>
            </Button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-muted pt-5 w-full">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-foreground/80 leading-tight">Giao nhanh tận nhà</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-foreground/80 leading-tight">Nguồn gốc sạch 100%</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <RotateCcw className="h-4 w-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-foreground/80 leading-tight">Đổi trả uy tín 24h</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lg:col-span-2 mt-4 w-full overflow-hidden">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto gap-6 overflow-x-auto scrollbar-none flex whitespace-nowrap">
            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-0 text-sm font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none">Mô tả sản phẩm</TabsTrigger>
            <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-0 text-sm font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none">Đặc điểm nổi bật</TabsTrigger>
            {product.nutritionFacts && (
              <TabsTrigger value="nutrition" className="rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-0 text-sm font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none">Thành phần dinh dưỡng</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="description" className="prose prose-sm max-w-none pt-5 outline-none w-full">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80 break-words">
              {product.description}
            </p>
          </TabsContent>
          <TabsContent value="features" className="pt-5 outline-none w-full">
            <ul className="grid gap-2.5 sm:grid-cols-2 w-full">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm min-w-0">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-foreground/80 break-words flex-1">{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          {product.nutritionFacts && (
            <TabsContent value="nutrition" className="pt-5 outline-none w-full">
              <div className="rounded-xl border overflow-hidden max-w-full sm:max-w-md bg-card">
                <table className="w-full text-sm">
                  <tbody>
                    {product.nutritionFacts.map((fact, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-muted-foreground truncate max-w-[150px]">
                          {fact.label}
                        </td>
                        <td className="py-2.5 px-4 text-right font-bold text-foreground whitespace-nowrap">
                          {fact.value}
                        </td>
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
