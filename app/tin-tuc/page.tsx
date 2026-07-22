import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { NewsCard } from '@/components/news/news-card';
import { fetchAllNews } from '@/lib/supabase-data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Tin tức',
  description:
    'Mẹo vặt nấu ăn, bảo quản gạo, kiến thức về đặc sản Việt và cách chọn gạo ngon.',
  alternates: { canonical: '/tin-tuc' },
  openGraph: {
    type: 'website',
    url: '/tin-tuc',
    title: 'Tin tức | Gạo Trần Huy',
    description: 'Mẹo vặt nấu ăn, bảo quản gạo, kiến thức về đặc sản Việt và cách chọn gạo ngon.',
  },
  twitter: {
    card: 'summary',
    title: 'Tin tức | Gạo Trần Huy',
    description: 'Mẹo vặt nấu ăn, bảo quản gạo, kiến thức về đặc sản Việt và cách chọn gạo ngon.',
  },
};

export default async function NewsPage() {
  const articles = await fetchAllNews();

  const breadcrumbItems = [{ name: 'Tin tức', href: '/tin-tuc' }];

  return (
    <>
      <PageHeader
        eyebrow="Tin tức & Kiến thức"
        title="Tin tức"
        subtitle="Mẹo vặt nấu ăn, bảo quản gạo, kiến thức về đặc sản Việt và cách chọn gạo ngon."
      />
      <div className="container-page py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </>
  );
}
