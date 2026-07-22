import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { NewsArticle } from '@/types';

interface ArticleNavigationProps {
  prev: NewsArticle | null;
  next: NewsArticle | null;
}

export function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Điều hướng bài viết" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/tin-tuc/${prev.slug}`}
          className="group flex flex-col rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Bài trước
          </span>
          <span className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/tin-tuc/${next.slug}`}
          className="group flex flex-col rounded-xl border bg-card p-4 text-right transition-all hover:border-primary/40 hover:shadow-md"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground">
            Bài tiếp theo
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}
