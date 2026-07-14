'use client';

import * as React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactInfo } from '@/data/site';

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3">
      {/* Zalo FAB */}
      <a
        href={`https://zalo.me/${contactInfo.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full bg-[#0068ff] text-white shadow-lg transition-all hover:bg-[#0056d6] hover:shadow-xl active:scale-95',
          'animate-scale-in'
        )}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.77 1.46 5.23 3.75 6.82L5 22l4.36-2.27c.84.2 1.72.3 2.64.3 5.52 0 10-3.94 10-8.8S17.52 2 12 2zm-1.5 13.5l-3-3 1.06-1.06 1.94 1.94 4.44-4.44L15.94 10l-5.44 5.5z"/>
        </svg>
      </a>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95',
          'animate-scale-in'
        )}
        aria-label="Lên đầu trang"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
