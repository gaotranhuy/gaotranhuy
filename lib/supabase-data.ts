import { cache } from 'react';
import { getSupabase } from '@/lib/supabase-server';
import { categories } from '@/data/categories';
import type { Product, NewsArticle, Category } from '@/types';

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  short_description: string | null;
  description: string | null;
  origin: string | null;
  weight: string | null;
  price: number;
  old_price: number | null;
  unit: string | null;
  image: string | null;
  gallery: string[] | null;
  features: string[] | null;
  nutrition_facts: { label: string; value: string }[] | null;
  tags: string[] | null;
  shopee_url: string | null;
  rating: number;
  review_count: number;
  sold_count: number;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  created_at: string;
}

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  image: string | null;
  author: string | null;
  published_at: string | null;
  reading_time: number;
  tags: string[] | null;
  created_at: string;
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug,
    shortDescription: row.short_description || '',
    description: row.description || '',
    origin: row.origin || '',
    weight: row.weight || '',
    price: row.price,
    oldPrice: row.old_price || undefined,
    unit: row.unit || '',
    image: row.image || '',
    gallery: row.gallery || [],
    features: row.features || [],
    nutritionFacts: row.nutrition_facts || [],
    tags: row.tags || [],
    shopeeUrl: row.shopee_url || undefined,
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count || 0,
    soldCount: row.sold_count || 0,
    inStock: row.in_stock,
    isFeatured: row.is_featured,
    isBestSeller: row.is_best_seller,
    isNew: row.is_new,
    createdAt: row.created_at,
  };
}

function mapBlogRow(row: BlogRow): NewsArticle {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    category: row.category || '',
    image: row.image || '',
    author: row.author || 'Gạo Trần Huy',
    publishedAt: row.published_at || row.created_at,
    readingTime: row.reading_time || 5,
    tags: row.tags || [],
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchProductCount(): Promise<number> {
  const supabase = getSupabase();

  const { count, error } = await supabase
    .from('products')
    .select('id', {
      head: true,
      count: 'exact',
    });

  if (error) return 0;

  return count ?? 0;
}
export const fetchProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProductRow(data as ProductRow);
});

export async function fetchProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', categorySlug)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchFeaturedProducts(limit?: number): Promise<Product[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchBestSellers(limit?: number): Promise<Product[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_best_seller', true)
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchNewProducts(limit?: number): Promise<Product[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', product.categorySlug)
    .neq('id', product.id)
    .limit(limit);

  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProductRow);
}

export async function fetchAllNews(): Promise<NewsArticle[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug,title,excerpt,content,category,image,author,published_at,reading_time,tags,created_at')
    .order('published_at', { ascending: false });

  if (error || !data) return [];
  return (data as BlogRow[]).map(mapBlogRow);
}

export const fetchNewsBySlug = cache(async (slug: string): Promise<NewsArticle | null> => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapBlogRow(data as BlogRow);
});

export async function fetchFeaturedNews(limit = 3): Promise<NewsArticle[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as BlogRow[]).map(mapBlogRow);
}

export async function fetchRelatedNews(article: NewsArticle, limit = 3): Promise<NewsArticle[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug,title,excerpt,category,image,author,published_at,reading_time,tags,created_at')
    .neq('slug', article.slug)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as BlogRow[]).map(mapBlogRow);
}

export async function fetchAdjacentNews(
  article: NewsArticle
): Promise<{ prev: NewsArticle | null; next: NewsArticle | null }> {
  const supabase = getSupabase();
  const publishedAt = article.publishedAt;

  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('slug,title,published_at')
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('blog_posts')
      .select('slug,title,published_at')
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const prev = prevResult.data && !prevResult.error
    ? mapBlogRow(prevResult.data as BlogRow)
    : null;
  const next = nextResult.data && !nextResult.error
    ? mapBlogRow(nextResult.data as BlogRow)
    : null;

  return { prev, next };
}

export async function fetchCtaProducts(article: NewsArticle, limit = 4): Promise<Product[]> {
  const supabase = getSupabase();

  if (article.tags.length > 0) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .overlaps('tags', article.tags)
      .eq('in_stock', true)
      .order('is_featured', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return (data as ProductRow[]).map(mapProductRow);
    }
  }

  const { data: featured, error: featError } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('in_stock', true)
    .limit(limit);

  if (!featError && featured && featured.length > 0) {
    return (featured as ProductRow[]).map(mapProductRow);
  }

  const { data: fallback, error: fbError } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('sold_count', { ascending: false })
    .limit(limit);

  if (!fbError && fallback) {
    return (fallback as ProductRow[]).map(mapProductRow);
  }

  return [];
}

export function getAllCategories(): Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export async function getCategoryProductCount(slug: string): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_slug', slug);

  if (error) return 0;
  return count || 0;
}
