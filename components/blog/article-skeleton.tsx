import { Skeleton } from '@/components/ui/skeleton';

export function ArticleHeroSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="mt-4 h-9 w-full sm:h-12 sm:w-4/5" />
      <Skeleton className="mt-2 h-9 w-2/3 sm:h-12 sm:w-1/2" />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-muted">
        <Skeleton className="absolute inset-0 h-full w-full" />
      </div>

      <Skeleton className="mt-6 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-11/12" />
      <Skeleton className="mt-2 h-5 w-4/5" />
    </div>
  );
}

export function ArticleBodySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />

      <Skeleton className="h-7 w-1/2" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="h-5 w-5/6" />

      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />

      <Skeleton className="h-7 w-2/5" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  );
}

export function TocSkeleton() {
  return (
    <nav aria-label="Mục lục" className="text-sm">
      <div className="hidden lg:block">
        <Skeleton className="mb-3 h-4 w-24" />
        <ul className="space-y-2 border-l border-border pl-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-4" style={{ width: `${80 - i * 12}%` }} />
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:hidden">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </nav>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <article className="container-page py-8">
      <div className="mb-6 flex items-center gap-1.5 text-sm">
        <Skeleton className="h-3.5 w-3.5 rounded" />
        <Skeleton className="h-3.5 w-3.5 rounded" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3.5 w-3.5 rounded" />
        <Skeleton className="h-4 w-40" />
      </div>

      <ArticleHeroSkeleton />

      <div className="mt-6 lg:hidden">
        <TocSkeleton />
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0 max-w-3xl lg:max-w-none">
          <ArticleBodySkeleton />

          <div className="mt-10 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>

          <div className="mt-8 border-t pt-6">
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TocSkeleton />
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-12 max-w-5xl">
        <Skeleton className="mb-6 h-7 w-64" />
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border bg-card"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="flex flex-1 flex-col p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-5 w-full" />
                <Skeleton className="mt-1.5 h-5 w-4/5" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1.5 h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
