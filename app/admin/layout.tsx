import type { Metadata, Viewport } from 'next';
import { isAdmin } from '@/lib/admin-auth';
import Link from 'next/link';
import { Package, FileText, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Quản trị - Gạo Trần Huy',
  description: 'Hệ thống quản trị nội dung',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isAdmin();

  if (!loggedIn) {
    return <>{children}</>;
  }

  const navLinks = [
    { href: '/admin/products', label: 'Sản phẩm', icon: Package },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin/products" className="flex items-center gap-2 font-bold">
              <span className="text-primary">GTH</span>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <link.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Xem site</span>
              </Button>
            </Link>
            <form action="/api/admin/logout" method="POST">
              <Button type="submit" variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
