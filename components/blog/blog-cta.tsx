import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, calculateDiscount } from '@/lib/format';
import { cloudinaryCard } from '@/lib/cloudinary';
import type { Product } from '@/types';

interface BlogCtaProps {
  products: Product[];
}

export function BlogCta({ products }: BlogCtaProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl border bg-gradient-to-br from-accent/40 to-muted/30 p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          Có thể bạn sẽ quan tâm
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => {
          const discount = calculateDiscount(product.price, product.oldPrice);
          return (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
            >
              <Link
                href={`/san-pham/${product.slug}`}
                className="relative block aspect-square overflow-hidden bg-muted/40"
              >
                <Image
                  src={cloudinaryCard(product.image)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  {product.isBestSeller && (
                    <Badge className="bg-amber-500 hover:bg-amber-500 text-[10px] px-2 py-0.5 border-none">
                      Bán chạy
                    </Badge>
                  )}
                  {discount && (
                    <Badge className="bg-rose-500 hover:bg-rose-500 text-[10px] px-2 py-0.5 border-none">
                      -{discount}%
                    </Badge>
                  )}
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-3">
                <Link
                  href={`/san-pham/${product.slug}`}
                  className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary"
                >
                  {product.name}
                </Link>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-base font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    /{product.unit}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/san-pham/${product.slug}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-accent hover:text-primary"
                  >
                    Xem sản phẩm
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <AddToCartButton
                    product={product}
                    size="icon"
                    className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
