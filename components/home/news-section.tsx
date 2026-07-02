import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/common/section-heading';
import { NewsCard } from '@/components/news/news-card';
import { getFeaturedNews } from '@/lib/news';

export function NewsSection() {
  const news = getFeaturedNews(3);
  const [featured, ...rest] = news;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <SectionHeading
            eyebrow="Tin tức"
            title="Mẹo vặt & kiến thức"
            description="Bí quyết nấu ăn, bảo quản gạo và kiến thức về đặc sản Việt."
            align="left"
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/tin-tuc">
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {featured && <NewsCard article={featured} featured />}
          <div className="grid gap-5">
            {rest.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
