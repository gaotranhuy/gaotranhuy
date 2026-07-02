'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ShoppingBag,
  Search,
  Phone,
  ChevronDown,
  X,
  Wheat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/lib/cart-context';
import { getAllCategories } from '@/lib/products';
import { contactInfo, siteSettings } from '@/data/site';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/san-pham', label: 'Sản phẩm', hasMega: true },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const categories = getAllCategories();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

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
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/80'
            : 'bg-background'
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo (Bản Desktop) */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {/* Đã tăng kích thước lên h-16 w-16 (hoặc đổi thành h-20 w-20 nếu muốn bự kịch khung máy tính) */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-none bg-transparent p-0">
              <img 
                src="/logo-brand.png" 
                alt="Gạo Trần Huy Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
                Gạo Trần Huy
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {siteSettings.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
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

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Tìm kiếm"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button
              asChild
              size="sm"
              className="hidden md:flex"
            >
              <a
                href={`https://zalo.me/${contactInfo.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Đặt hàng Zalo
              </a>
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
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
                  {/* Logo (Bản Mobile ẩn trong menu rút gọn) */}
                  <SheetTitle className="flex items-center gap-2">
                    {/* Đã tăng kích thước logo bản mobile lên h-12 w-12 */}
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-none bg-transparent p-0">
                      <img 
                        src="/logo-brand.png" 
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
                        'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                        isActive(link.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-accent'
                      )}
                    >
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
                        className="rounded-lg px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-6 border-t pt-4">
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {contactInfo.phone}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t bg-background animate-fade-in">
            <div className="container-page py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/san-pham?q=${encodeURIComponent(
                      searchQuery.trim()
                    )}`;
                  }
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm gạo, nước mắm, dầu lạc..."
                    className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button type="submit" size="lg">
                  Tìm kiếm
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
