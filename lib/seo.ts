import type { Metadata } from 'next';
import type { Product, NewsArticle, Category } from '@/types';
import { formatPrice } from './format';

const SITE_URL = 'https://gaotranhuy.vn';
const SITE_NAME = 'Gạo Trần Huy';

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function productJsonLd(product: Product) {
  const result: any = {
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
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 30000,
          currency: 'VND'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'VN'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'DAY'
          }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'VN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByShipping',
        returnFees: 'https://schema.org/FreeReturnShipping'
      }
    }
  };

  if (product.oldPrice) {
    result.offers.price = product.price;
  }

  if (product.rating > 0) {
    result.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    };
  }

  return result;
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    sameAs: [
      'https://www.facebook.com/gaotranhuy',
      'https://zalo.me/gaotranhuy'
    ]
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
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png')
      }
    },
    mainEntityOfPage: absoluteUrl(`/tin-tuc/${article.slug}`)
  };
}

export function productMetadata(product: Product): Metadata {
  return {
    title: product.name,
    description: product.shortDescription || product.description,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: {
      type: 'website',
      url: absoluteUrl(`/san-pham/${product.slug}`),
      title: `${product.name} | ${SITE_NAME}`,
      description: product.shortDescription || product.description,
      images: [{ url: product.image, alt: product.name }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${SITE_NAME}`,
      description: product.shortDescription || product.description,
      images: [product.image]
    }
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
      images: [{ url: article.image, alt: article.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | ${SITE_NAME}`,
      description: article.excerpt,
      images: [article.image]
    }
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
      description: category.description
    },
    twitter: {
      card: 'summary',
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description
    }
  };
}
