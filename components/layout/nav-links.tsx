'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Wheat } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/san-pham', label: 'Sản phẩm', hasMega: true },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/lien-he', label: 'Liên hệ' },
  { href: '/admin/login', label: 'Admin' },
];

export function NavLinks({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {navLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <div key={link.href} className="group relative">
            <Link
              href={link.href}
              className={cn(
                'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'text-primary'
                  : 'text-foreground/80 hover:text-primary'
              )}
            >
              {link.label}
              {link.hasMega && (
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              )}
            </Link>
            {link.hasMega && (
              <div className="invisible absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border bg-popover p-3 shadow-xl">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/danh-muc/${cat.slug}`}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Wheat className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {cat.name}
                        </div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">
                          {cat.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
