'use client';

import * as React from 'react';
import { ChevronDown, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [items, setItems] = React.useState<TocItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    const article = document.querySelector('[data-article-body]');
    if (!article) return;
    const headings = Array.from(article.querySelectorAll('h2, h3, h4'));
    const toc: TocItem[] = headings
      .filter((h) => h.id)
      .map((h) => ({
        id: h.id,
        text: h.textContent ?? '',
        level: Number(h.tagName.replace('H', '')),
      }));
    setItems(toc);
  }, []);

  React.useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <nav aria-label="Mục lục" className="text-sm">
      {/* Mobile: collapsible */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3 font-semibold"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" />
            Mục lục
          </span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <ul className="mt-2 space-y-1.5 rounded-lg border border-border bg-background p-4">
            {items.map((item) => (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    'block text-muted-foreground hover:text-primary',
                    activeId === item.id && 'font-semibold text-primary'
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: sticky */}
      <div className="hidden lg:block">
        <p className="mb-3 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-foreground">
          <List className="h-4 w-4 text-primary" />
          Mục lục
        </p>
        <ul className="space-y-1.5 border-l border-border pl-4">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  'block py-0.5 text-muted-foreground transition-colors hover:text-primary',
                  activeId === item.id
                    ? 'border-l-2 -ml-[1.1rem] pl-[calc(1rem-2px)] font-semibold text-primary'
                    : ''
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
