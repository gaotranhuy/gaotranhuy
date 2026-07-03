'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/product-grid';
import { SectionHeading } from '@/components/common/section-heading';
import type { Product } from '@/types';

type Tab = 'featured' | 'bestseller' | 'new';

const tabs: { id: Tab; label: string }[] = [
  { id: 'featured', label: 'Nổi bật' },
  { id: 'bestseller', label: 'Bán chạy' },
  { id: 'new', label: 'Mới về' },
];

interface FeaturedProductsClientProps {
  featured: Product[];
  bestSellers: Product[];
  newProducts: Product[];
}

export function FeaturedProductsClient({
  featured,
  bestSellers,
  newProducts,
}: FeaturedProductsClientProps) {
  const [active, setActive] = React.useState<Tab>('featured');

  const products = React.useMemo(() => {
    if (active === 'featured') return featured;
    if (active === 'bestseller') return bestSellers;
    return newProducts;
  }, [active, featured, bestSellers, newProducts]);

  return (
    <section className="bg-accent/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            eyebrow="Sản phẩm"
            title="Sản phẩm nổi bật"
            description="Những sản phẩm được khách hàng tin dùng nhất tại Gạo Trần Huy."
          />

          {/* Tabs */}
          <div className="inline-flex items-center gap-1 rounded-full border bg-background p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  active === tab.id
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <ProductGrid products={products} columns={4} />
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/san-pham">
              Xem tất cả sản phẩm
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
