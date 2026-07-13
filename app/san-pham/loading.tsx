import { ProductListSkeleton } from '@/components/product/products-skeleton';

export default function ProductsLoading() {
  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
      <ProductListSkeleton />
    </div>
  );
}
