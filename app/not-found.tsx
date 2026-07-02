import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="font-display text-8xl font-extrabold text-primary/20 sm:text-9xl">
        404
      </div>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Không tìm thấy trang
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        Trang bạn đang tìm có thể đã bị xóa, đổi tên hoặc tạm thời không khả
        dụng. Hãy quay lại trang chủ hoặc khám phá sản phẩm.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="mr-1 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/san-pham">
            <Search className="mr-1 h-4 w-4" />
            Khám phá sản phẩm
          </Link>
        </Button>
      </div>
    </div>
  );
}
