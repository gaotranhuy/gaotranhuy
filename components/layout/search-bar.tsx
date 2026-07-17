'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex"
        onClick={() => setOpen((o) => !o)}
        aria-label="Tìm kiếm"
      >
        <Search className="h-5 w-5" />
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-full border-t bg-background/95 sm:backdrop-blur">
          <div className="container-page py-3">
            <input
              type="text"
              autoFocus
              placeholder="Tìm sản phẩm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/san-pham?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </>
  );
}
