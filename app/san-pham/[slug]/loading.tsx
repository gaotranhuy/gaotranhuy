import { ProductDetailSkeleton } from '@/components/product/products-skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="container-page py-8">
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-muted" />
      <ProductDetailSkeleton />
    </div>
  );
}
