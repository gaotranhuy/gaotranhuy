import { NewsCard } from './news-card';
import { getRelatedNews } from '@/lib/news';
import type { NewsArticle } from '@/types';

export function RelatedNews({ article }: { article: NewsArticle }) {
  const related = getRelatedNews(article, 3);
  if (related.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight">
        Bài viết liên quan
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {related.map((a) => (
          <NewsCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
