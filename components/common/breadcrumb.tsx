import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center gap-1.5 text-sm text-muted-foreground',
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center transition-colors hover:text-primary"
        aria-label="Trang chủ"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast && 'font-medium text-foreground',
                  'line-clamp-1'
                )}
              >
                {item.name}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
