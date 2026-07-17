'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, Shield, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { contactInfo } from '@/data/site';
import { getAllCategories } from '@/lib/products';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/san-pham', label: 'Sản phẩm' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/lien-he', label: 'Liên hệ' },
  { href: '/admin/login', label: 'Admin' },
];

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const categories = getAllCategories();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[340px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-none bg-transparent p-0">
              <img
                src="/logo_brand.png"
                alt="Gạo Trần Huy Logo"
                className="h-full w-full object-contain"
              />
            </div>
            Gạo Trần Huy
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-accent'
              )}
            >
              {link.href === '/admin' && <Shield className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-6 border-t pt-4">
          <div className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Danh mục
          </div>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent"
              >
                <Wheat className="h-4 w-4 text-primary" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <a
            href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-primary"
          >
            <Phone className="h-4 w-4" />
            {contactInfo.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
