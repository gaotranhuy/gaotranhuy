'use client';

import * as React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  label?: string;
  showSuccess?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = 'default',
  size = 'default',
  className,
  label = 'Thêm vào giỏ',
  showSuccess = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product, quantity);
    if (showSuccess) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const isIcon = size === 'icon';

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAdd}
      disabled={!product.inStock}
      className={cn(
        'transition-all duration-300',
        added && 'bg-success text-success-foreground hover:bg-success/90 border-none', 
        className
      )}
      title={!product.inStock ? 'Tạm hết hàng' : label}
    >
      {added ? (
        <>
          <Check className="h-4 w-4 shrink-0 animate-scale-in" />
          {/* Nếu là size icon thì ẩn chữ đi để không vỡ nút vuông */}
          <span className={cn(isIcon ? 'sr-only' : 'ml-1.5')}>Đã thêm</span>
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span className={cn(isIcon ? 'sr-only' : 'ml-1.5')}>
            {product.inStock ? label : 'Hết hàng'}
          </span>
        </>
      )}
    </Button>
  );
}
