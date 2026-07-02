import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { RelatedNews } from '@/components/news/related-news';
import { getAllNews, getNewsBySlug } from '@/lib/news';
import { articleMetadata, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { formatDateLong } from '@/lib/format';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllNews().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getNewsBySlug(params.slug);
  if (!article) return { title: 'Không tìm thấy' };
  return articleMetadata(article);
}

export default function NewsDetailPage({ params }: PageProps) {
  const article = getNewsBySlug(params.slug);
  if (!article) notFound();

  const breadcrumbItems = [
    { name: 'Tin tức', url: '/tin-tuc' },
    { name: article.title, url: `/tin-tuc/${article.slug}` },
  ];

  // Parse content into sections
  const sections = article.content.split(/\n##\s+/);

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

        <div className="mx-auto max-w-3xl">
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
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <p className="mt-6 text-lg font-medium text-foreground/90">
            {article.excerpt}
          </p>

          <div className="prose prose-sm mt-6 max-w-none sm:prose-base">
            {sections.map((section, i) => {
              const lines = section.split('\n');
              const [heading, ...body] = lines;
              return (
                <div key={i} className="mb-6">
                  {i > 0 && (
                    <h2 className="mb-3 font-display text-xl font-bold sm:text-2xl">
                      {heading.trim()}
                    </h2>
                  )}
                  <div className="space-y-3 text-foreground/80">
                    {body
                      .join('\n')
                      .split('\n')
                      .filter((l) => l.trim())
                      .map((line, j) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <p key={j} className="font-semibold text-foreground">
                              {line.replace(/\*\*/g, '')}
                            </p>
                          );
                        }
                        return (
                          <p key={j} className="leading-relaxed">
                            {line.replace(/- /, '• ')}
                          </p>
                        );
                      })}
                  </div>
                </div>
              );
            })}
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

        <div className="mx-auto mt-12 max-w-5xl">
          <RelatedNews article={article} />
        </div>
      </article>
    </>
  );
}
