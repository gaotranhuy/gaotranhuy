'use client';

import * as React from 'react';
import { Facebook, Link2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  slug: string;
  title: string;
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = React.useState('');

  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const articleUrl = currentUrl || `https://gaotranhuy.vn/tin-tuc/${slug}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
    {
      label: 'Zalo',
      icon: ZaloIcon,
      href: `https://zalo.me/share?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-[#0068FF] hover:text-white hover:border-[#0068FF]',
    },
    {
      label: 'X',
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      toast.success('Đã sao chép liên kết');
    } catch {
      toast.error('Không sao chép được liên kết');
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-3 border-t pt-6">
      <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Share2 className="h-4 w-4" />
        Chia sẻ bài viết
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {shareLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chia sẻ lên ${item.label}`}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-foreground transition-all',
              item.color
            )}
          >
            <item.icon className="h-4 w-4" />
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Sao chép liên kết"
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <Link2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 5.582 2 10c0 2.247 1.182 4.274 3.065 5.694L4 20l4.9-2.582C10.43 17.798 11.2 18 12 18c5.523 0 10-3.582 10-8s-4.477-8-10-8zm0 14c-.83 0-1.627-.12-2.372-.341l-.31-.093-2.318 1.22.623-2.093-.25-.187C5.39 13.46 4.5 11.803 4.5 10c0-3.582 3.358-6.5 7.5-6.5s7.5 2.918 7.5 6.5-3.358 6.5-7.5 6.5z" />
      <path d="M16.5 11.5h-2.25v-.75h1.5v-1.5h-1.5V8.75h2.25V7h-3.75v6h3.75v-1.5zm-5.25 0H9v-.75h1.5v-1.5H9V8.75h2.25V7H7.5v6h3.75v-1.5z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
