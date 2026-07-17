import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo, siteSettings } from '@/data/site';
import { getAllCategories } from '@/lib/products';
import { HeaderCart } from './header-cart';
import { SearchBar } from './search-bar';
import { ScrollHeader } from './scroll-header';
import { NavLinks } from './nav-links';

const MobileMenu = dynamic(() => import('./mobile-menu').then((m) => m.MobileMenu), {
  loading: () => (
    <button
      className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
      aria-label="Menu"
    />
  ),
});

export function SiteHeader() {
  const categories = getAllCategories();

  return (
    <>
      {/* Top bar */}
      <div className="hidden bg-primary text-primary-foreground lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Hotline: {contactInfo.phone}
            </span>
            <span className="text-primary-foreground/70">|</span>
            <span>{contactInfo.workingHours}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Miễn phí giao hàng đơn từ 500.000đ</span>
            <span className="text-primary-foreground/70">|</span>
            <span>Giao hàng toàn quốc - Thanh toán tại nhà</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <ScrollHeader>
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-none bg-transparent p-0">
              <Image
                src="/logo_brand.png"
                alt="Gạo Trần Huy Logo"
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold tracking-tight text-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground">
                {siteSettings.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <NavLinks categories={categories} />

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <SearchBar />
            <HeaderCart />
            <Button asChild size="sm" className="hidden md:flex">
              <a
                href={`https://zalo.me/${contactInfo.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Đặt hàng Zalo
              </a>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </ScrollHeader>
    </>
  );
}
