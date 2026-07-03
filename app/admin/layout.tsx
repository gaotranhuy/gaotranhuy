import type { Metadata } from 'next';
import { isAdmin } from '@/lib/admin-auth';
import Link from 'next/link';
import { Package, FileText, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Quản trị - Gạo Trần Huy',
  description: 'Hệ thống quản trị nội dung',
  robots: { index: false, follow: false },
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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/products" className="flex items-center gap-2 font-bold">
              <span className="text-primary">GTH</span>
              <span className="text-sm text-muted-foreground">Admin</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Package className="h-4 w-4" />
                  Sản phẩm
                </Button>
              </Link>
              <Link href="/admin/blog">
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Blog
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Xem site
              </Button>
            </Link>
            <form action="/api/admin/logout" method="POST">
              <Button type="submit" variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
