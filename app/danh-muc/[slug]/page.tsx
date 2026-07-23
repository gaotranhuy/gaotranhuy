import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ProductGrid } from '@/components/product/product-grid';
import { ContactCTA } from '@/components/common/contact-cta';
import {
  getCategoryBySlug,
  getAllCategories,
} from '@/lib/products';
import { fetchProductsByCategory } from '@/lib/supabase-data';
import { categoryMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: 'Không tìm thấy' };
  return categoryMetadata(cat);
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await fetchProductsByCategory(slug);

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
