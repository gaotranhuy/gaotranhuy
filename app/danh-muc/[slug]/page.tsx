import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ProductGrid } from '@/components/product/product-grid';
import { ContactCTA } from '@/components/common/contact-cta';
import {
  getCategoryBySlug,
  getAllCategories,
  getProductsByCategory,
} from '@/lib/products';
import { categoryMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return { title: 'Không tìm thấy' };
  return categoryMetadata(cat);
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = getProductsByCategory(params.slug);

  const breadcrumbItems = [
    { name: 'Sản phẩm', url: '/san-pham' },
    { name: category.name, url: `/danh-muc/${category.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <PageHeader
        eyebrow="Danh mục"
        title={category.name}
        description={category.longDescription}
      />
      <div className="container-page py-8">
        <Breadcrumb
          items={breadcrumbItems.map((b) => ({ name: b.name, href: b.url }))}
          className="mb-6"
        />
        <div className="mb-4 text-sm text-muted-foreground">
          {products.length} sản phẩm trong danh mục
        </div>
        <ProductGrid products={products} columns={4} />
      </div>
      <ContactCTA />
    </>
  );
}
