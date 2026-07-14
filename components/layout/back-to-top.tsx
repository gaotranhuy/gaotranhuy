'use client';

import * as React from 'react';
import Image from 'next/image';
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
        <Image
          src="/icons/zalo.svg"
          alt="Zalo"
          width={24}
          height={24}
          className="h-6 w-6"
          priority
        />
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
