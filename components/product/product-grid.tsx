import { ProductCard } from './product-card';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  className,
}: ProductGridProps) {
  const colsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
        <p className="text-base font-medium">Không tìm thấy sản phẩm</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Hãy thử từ khóa khác hoặc xem tất cả sản phẩm.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 sm:gap-5', colsClass, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
