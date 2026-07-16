'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/format';
import { siteSettings } from '@/data/site';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
    totalItems,
  } = useCartStore();

  const remainingForFreeShip = Math.max(
    0,
    siteSettings.freeShippingThreshold - totalPrice
  );
  const freeShipProgress = Math.min(
    100,
    (totalPrice / siteSettings.freeShippingThreshold) * 100
  );

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Giỏ hàng ({totalItems})
          </SheetTitle>
          <SheetDescription className="sr-only">
            Danh sách sản phẩm trong giỏ hàng
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Giỏ hàng trống</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục.
              </p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link href="/san-pham">Khám phá sản phẩm</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b bg-accent/30 p-4">
              {remainingForFreeShip > 0 ? (
                <p className="mb-2 text-xs text-foreground/80">
                  Mua thêm{' '}
                  <span className="font-semibold text-primary">
                    {formatPrice(remainingForFreeShip)}
                  </span>{' '}
                  để được <span className="font-semibold">miễn phí giao hàng</span>
                </p>
              ) : (
                <p className="mb-2 text-xs font-medium text-success">
                  Bạn được miễn phí giao hàng!
                </p>
              )}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${freeShipProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex gap-3 rounded-xl border bg-card p-3"
                  >
                    <Link
                      href={`/san-pham/${item.product.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/san-pham/${item.product.slug}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-medium hover:text-primary"
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
                        {item.product.unit}
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg border">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                            aria-label="Giảm"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                            aria-label="Tăng"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" onClick={closeCart}>
                  <Link href="/gio-hang">Xem giỏ hàng</Link>
                </Button>
                <Button asChild onClick={closeCart}>
                  <Link href="/dat-hang">
                    Đặt hàng
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
