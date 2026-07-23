import { Skeleton } from '@/components/ui/skeleton';

function NewsCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Skeleton className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="mt-2 h-5 w-full" />
        <Skeleton className="mt-1.5 h-5 w-4/5" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
      </div>
    </div>
  );
}

export function NewsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}
