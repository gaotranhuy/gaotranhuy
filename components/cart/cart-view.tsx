'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/format';
import { siteSettings } from '@/data/site';
import { cloudinaryThumb } from '@/lib/cloudinary';

export function CartView() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Giỏ hàng trống</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </p>
        </div>
        <Button asChild>
          <Link href="/san-pham">
            Khám phá sản phẩm
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const shippingFee =
    totalPrice >= siteSettings.freeShippingThreshold
      ? 0
      : siteSettings.shippingFee;
  const grandTotal = totalPrice + shippingFee;

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight">
        Giỏ hàng ({totalItems})
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 rounded-2xl border bg-card p-4"
            >
              <Link
                href={`/san-pham/${item.product.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28"
              >
                <Image
                  src={cloudinaryThumb(item.product.image)}
                  alt={item.product.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/san-pham/${item.product.slug}`}
                    className="text-sm font-semibold hover:text-primary sm:text-base"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.product.unit} · {item.product.origin}
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                      aria-label="Giảm"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                      aria-label="Tăng"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary sm:text-base">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(item.product.price)} / {item.product.unit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Button asChild variant="outline">
              <Link href="/san-pham">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Tiếp tục mua sắm
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Xóa tất cả
            </Button>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí giao hàng</span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-success">Miễn phí</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="rounded-lg bg-accent/50 p-2 text-xs text-muted-foreground">
                  Mua thêm{' '}
                  <span className="font-semibold text-primary">
                    {formatPrice(
                      siteSettings.freeShippingThreshold - totalPrice
                    )}
                  </span>{' '}
                  để được miễn phí giao hàng.
                </p>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
            <Button asChild size="lg" className="mt-5 w-full">
              <Link href="/dat-hang">
                Tiến hành đặt hàng
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Thanh toán an toàn, bảo mật
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
