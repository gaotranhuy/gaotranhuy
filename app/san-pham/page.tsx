import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ProductFilters } from '@/components/product/product-filters';
import { fetchAllProducts, getAllCategories } from '@/lib/supabase-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Tất cả sản phẩm',
  description:
    'Khám phá tất cả sản phẩm của Gạo Trần Huy: gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm nhĩ Nam Ô, dầu lạc nguyên chất.',
  alternates: { canonical: '/san-pham' },
};

export default async function ProductsPage() {
  const products = await fetchAllProducts();
  const categories = getAllCategories();

  return (
    <>
      <PageHeader
        eyebrow="Sản phẩm"
        title="Tất cả sản phẩm"
        description="Gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm nhĩ Nam Ô, dầu lạc nguyên chất và các đặc sản nông sản vùng miền."
      />
      <div className="container-page py-8">
        <Breadcrumb
          items={[{ name: 'Sản phẩm' }]}
          className="mb-6"
        />
        <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Đang tải...</div>}>
          <ProductFilters
            products={products}
            categories={categories}
          />
        </Suspense>
      </div>
    </>
  );
}
