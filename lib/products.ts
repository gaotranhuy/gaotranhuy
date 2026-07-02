import { products } from '@/data/products';
import { categories } from '@/data/categories';
import type { Product, Category } from '@/types';

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featured = products.filter((p) => p.isFeatured);
  return limit ? featured.slice(0, limit) : featured;
}

export function getBestSellers(limit?: number): Product[] {
  const bestSellers = products.filter((p) => p.isBestSeller);
  return limit ? bestSellers.slice(0, limit) : bestSellers;
}

export function getNewProducts(limit?: number): Product[] {
  const sorted = [...products].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getRelatedProducts(
  product: Product,
  limit = 4
): Product[] {
  return products
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id
    )
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getAllCategories(): Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryProductCount(slug: string): number {
  return products.filter((p) => p.categorySlug === slug).length;
}
