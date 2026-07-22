import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate, formatNumber, calculateReadingTime } from '@/lib/format';
import { cloudinaryCard, cloudinaryBanner } from '@/lib/cloudinary';
import type { NewsArticle } from '@/types';
import { cn } from '@/lib/utils';

export function NewsCard({
  article,
  featured = false,
}: {
  article: NewsArticle;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <Link
        href={`/tin-tuc/${article.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg md:flex-row"
      >
        <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:w-1/2">
          <Image
            src={cloudinaryBanner(article.image)}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
            {article.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime || calculateReadingTime(article.content)} phút đọc
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl font-bold leading-tight transition-colors group-hover:text-primary sm:text-2xl">
            {article.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Đọc tiếp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg'
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={cloudinaryCard(article.image)}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readingTime || calculateReadingTime(article.content)} phút
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-display text-base font-bold leading-tight transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
