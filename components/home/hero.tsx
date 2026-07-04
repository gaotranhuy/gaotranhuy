import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo } from '@/data/site';

// Khai báo kiểu dữ liệu đầu vào nhận từ Server Component (app/page.tsx)
interface HeroProps {
  totalProducts: number;
}

export function Hero({ totalProducts }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 via-background to-background">
      <div className="grain-bg absolute inset-0 opacity-60" />
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-warning/10 blur-3xl" />

      <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        {/* Left content */}
        <div className="flex flex-col items-start gap-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Gạo sạch - Đặc sản Việt - Giao tận nhà
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Gạo thơm dẻo,{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">đặc sản Việt</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 -skew-x-3 bg-primary/15" />
            </span>{' '}
            từ Gạo Trần Huy
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm nhĩ Nam Ô và
            dầu lạc nguyên chất. Tuyển chọn từ những vùng đất trù phú nhất Việt
            Nam, giao hàng tận nơi.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="text-base">
              <Link href="/san-pham">
                Khám phá sản phẩm
                <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <a
                href={`https://zalo.me/${contactInfo.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Đặt hàng qua Zalo
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-6 border-t pt-6">
            <div>
              {/* 
                BỔ SUNG AN TOÀN: 
                Nếu chưa kịp lấy dữ liệu từ database, mặc định hiện 13.
                Thêm `+` đằng sau nếu anh muốn giữ định dạng như cũ (Ví dụ: 13+)
              */}
              <div className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                {totalProducts ? `${totalProducts}+` : '13+'}
              </div>
              <div className="text-xs text-muted-foreground sm:text-sm">
                Sản phẩm
              </div>
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                100%
              </div>
              <div className="text-xs text-muted-foreground sm:text-sm">
                Gạo thật
              </div>
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                24h
              </div>
              <div className="text-xs text-muted-foreground sm:text-sm">
                Giao nhanh
              </div>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="relative animate-fade-in">
          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-muted shadow-2xl">
            <Image
              src="https://res.cloudinary.com/f9krxetg/image/upload/v1783168677/IMG_7085_rvamwo.avif"
              alt="Gạo thơm dẻo đặc sản Gạo Trần Huy"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
          </div>

          {/* Floating cards */}
          <div className="absolute -left-4 top-8 flex items-center gap-2 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur animate-float sm:-left-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold">Cam kết</div>
              <div className="text-[11px] text-muted-foreground">
                Gạo thật 100%
              </div>
            </div>
          </div>

          <div
            className="absolute -right-4 bottom-12 flex items-center gap-2 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur animate-float sm:-right-8"
            style={{ animationDelay: '1s' }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold">Giao hàng</div>
              <div className="text-[11px] text-muted-foreground">
                Toàn quốc 24h
              </div>
            </div>
          </div>

          <div
            className="absolute right-8 top-4 flex items-center gap-2 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur animate-float"
            style={{ animationDelay: '2s' }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-semibold">4.8/5</div>
              <div className="text-[11px] text-muted-foreground">
                1.000+ đánh giá
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative">
        <svg
          className="block h-12 w-full text-background sm:h-16"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
