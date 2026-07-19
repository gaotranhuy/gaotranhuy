import { cn } from '@/lib/utils';
import { ScrollHeaderClient } from './scroll-header-client';

export function ScrollHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-background transition-colors duration-300',
        className
      )}
    >
      <ScrollHeaderClient />
      {children}
    </header>
  );
}
