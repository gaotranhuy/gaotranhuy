import type { Metadata } from 'next';
import type { Product, NewsArticle, Category } from '@/types';
import { formatPrice } from './format';

const SITE_URL = 'https://gaotranhuy.vn';
const SITE_NAME = 'Gạo Trần Huy';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/san-pham/${product.slug}`),
      priceCurrency: 'VND',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function articleJsonLd(article: NewsArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [absoluteUrl(article.image)],
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    mainEntityOfPage: absoluteUrl(`/tin-tuc/${article.slug}`),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    sameAs: [
      'https://facebook.com/gaotranhuy',
      'https://tiktok.com/@gaotranhuy',
    ],
  };
}

export function productMetadata(product: Product): Metadata {
  const title = `${product.name} - ${formatPrice(product.price)}`;
  const description = product.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: {
      type: 'website',
      url: absoluteUrl(`/san-pham/${product.slug}`),
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: [product.image],
    },
  };
}

export function categoryMetadata(category: Category): Metadata {
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/danh-muc/${category.slug}` },
    openGraph: {
      type: 'website',
      url: absoluteUrl(`/danh-muc/${category.slug}`),
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description,
      images: [{ url: category.image, alt: category.name }],
    },
  };
}

export function articleMetadata(article: NewsArticle): Metadata {
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/tin-tuc/${article.slug}` },
    openGraph: {
      type: 'article',
      url: absoluteUrl(`/tin-tuc/${article.slug}`),
      title: `${article.title} | ${SITE_NAME}`,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      images: [{ url: article.image, alt: article.title }],
    },
  };
}
