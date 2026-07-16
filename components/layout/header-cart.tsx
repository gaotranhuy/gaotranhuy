'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';

export function HeaderCart() {
  const { totalItems, openCart } = useCartStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openCart}
      aria-label="Giỏ hàng"
    >
      <ShoppingCart className="h-6 w-6 stroke-[2.4]" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow">
          {totalItems}
        </span>
      )}
    </Button>
  );
}
