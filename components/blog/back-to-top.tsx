'use client';

import * as React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const update = () => {
      rafRef.current = null;
      setVisible(window.scrollY > 400);
    };
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full',
        'bg-primary text-primary-foreground shadow-lg transition-all duration-300',
        'hover:bg-primary/90 hover:scale-110 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      )}
      aria-label="Về đầu trang"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
