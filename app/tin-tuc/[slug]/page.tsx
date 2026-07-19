import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { RelatedNews } from '@/components/news/related-news';
import { fetchNewsBySlug } from '@/lib/supabase-data';
import { articleMetadata, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { formatDateLong } from '@/lib/format';
import { cloudinaryBanner } from '@/lib/cloudinary';
import { buildToc } from '@/components/news/markdown-content';

const MarkdownContent = dynamic(
  () => import('@/components/news/markdown-content').then((m) => m.MarkdownContent),
  { ssr: true, loading: () => (
    <div className="space-y-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
    </div>
  ) }
);

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchNewsBySlug(slug);
  if (!article) return { title: 'Không tìm thấy' };
  return articleMetadata(article);
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchNewsBySlug(slug);
  if (!article) notFound();

  const breadcrumbItems = [
    { name: 'Tin tức', url: '/tin-tuc' },
    { name: article.title, url: `/tin-tuc/${article.slug}` },
  ];

  const toc = buildToc(article.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <article className="container-page py-8">
        <Breadcrumb
          items={breadcrumbItems.map((b) => ({ name: b.name, href: b.url }))}
          className="mb-6"
        />

        <div className="mx-auto max-w-[800px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {article.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDateLong(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {article.readingTime} phút đọc
            </span>
          </div>

          <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-muted">
            <Image
              src={cloudinaryBanner(article.image)}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>

          <p className="mt-6 text-lg font-medium leading-relaxed text-foreground/90">
            {article.excerpt}
          </p>

          <div className="mt-8">
            <MarkdownContent content={article.content} />
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground/70"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-8 border-t pt-6">
            <Button asChild variant="outline">
              <Link href="/tin-tuc">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Quay lại tin tức
              </Link>
            </Button>
          </div>
        </div>

        {toc.length > 0 && (
          <aside className="mx-auto mt-12 max-w-[800px] rounded-xl border bg-muted/30 p-5">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Mục lục
            </h2>
            <nav className="space-y-1 text-sm">
              {toc.map((item, i) => (
                <a
                  key={`${item.id}-${i}`}
                  href={`#${item.id}`}
                  className="block text-muted-foreground transition-colors hover:text-primary"
                  style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div className="mx-auto mt-12 max-w-5xl">
          <RelatedNews article={article} />
        </div>
      </article>
    </>
  );
}
