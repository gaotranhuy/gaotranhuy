import { ProductGrid } from './product-grid';
import { getRelatedProducts } from '@/lib/products';
import type { Product } from '@/types';

export function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Gợi ý
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Sản phẩm tương tự
          </h2>
        </div>
      </div>
      <ProductGrid products={related} columns={4} />
    </section>
  );
}
