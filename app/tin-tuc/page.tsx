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
};

export default async function NewsPage() {
  const articles = await fetchAllNews();

  return (
    <>
      <PageHeader
        eyebrow="Tin tức"
        title="Mẹo vặt & kiến thức"
        description="Bí quyết nấu ăn, bảo quản gạo và kiến thức về đặc sản nông sản Việt Nam."
      />
      <div className="container-page py-8">
        <Breadcrumb items={[{ name: 'Tin tức' }]} className="mb-6" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </>
  );
}
