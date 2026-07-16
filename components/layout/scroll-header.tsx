'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function ScrollHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 shadow-md sm:supports-[backdrop-filter]:bg-background/80 sm:backdrop-blur'
          : 'bg-background',
        className
      )}
    >
      {children}
    </header>
  );
}
