import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetail } from '@/components/product/product-detail';
import { RelatedProducts } from '@/components/product/related-products';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ContactCTA } from '@/components/common/contact-cta';
import {
  getProductBySlug,
  getAllProducts,
  getCategoryBySlug,
} from '@/lib/products';
import {
  productMetadata,
  productJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Không tìm thấy sản phẩm' };
  return productMetadata(product);
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);

  const breadcrumbItems = [
    { name: 'Sản phẩm', url: '/san-pham' },
    ...(category
      ? [{ name: category.name, url: `/danh-muc/${category.slug}` }]
      : []),
    { name: product.name, url: `/san-pham/${product.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <div className="container-page py-8">
        <Breadcrumb
          items={breadcrumbItems.map((b) => ({ name: b.name, href: b.url }))}
          className="mb-6"
        />
        <ProductDetail product={product} />
        <RelatedProducts product={product} />
      </div>
      <ContactCTA />
    </>
  );
}
