import { newsArticles } from '@/data/news';
import type { NewsArticle } from '@/types';

export function getAllNews(): NewsArticle[] {
  return [...newsArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getRelatedNews(
  article: NewsArticle,
  limit = 3
): NewsArticle[] {
  return newsArticles
    .filter((a) => a.slug !== article.slug)
    .filter(
      (a) =>
        a.category === article.category ||
        a.tags.some((t) => article.tags.includes(t))
    )
    .slice(0, limit);
}

export function getFeaturedNews(limit = 3): NewsArticle[] {
  return [...newsArticles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}
