import { PageHeader } from '@/components/common/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsListSkeleton } from '@/components/news/news-skeleton';

export default function NewsLoading() {
  return (
    <>
      <PageHeader
        eyebrow="Tin tức"
        title="Mẹo vặt & kiến thức"
        description="Bí quyết nấu ăn, bảo quản gạo và kiến thức về đặc sản nông sản Việt Nam."
      />
      <div className="container-page py-8">
        <nav className="mb-6 flex items-center gap-1.5 text-sm">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-4 w-16" />
        </nav>
        <NewsListSkeleton count={6} />
      </div>
    </>
  );
}
