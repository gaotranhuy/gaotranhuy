import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo } from '@/data/site';

export function CTASection() {
  const shopeeShopUrl = contactInfo.shopee;
  const grabMartUrl = contactInfo.grabMart;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-12 text-primary-foreground shadow-xl sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-warning/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Đặt hàng ngay - Giao tận nơi
              </h2>
              <p className="mt-3 text-base text-primary-foreground/90">
                Gọi hotline, đặt qua GrabMart hoặc ghé thăm gian hàng Shopee để được tư vấn và đặt hàng nhanh
                chóng. Giao hàng toàn quốc, thanh toán tại nhà.
              </p>
            </div>
            
            <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              {/* 1. Nút Gọi Hotline - Nền phụ mờ sang trọng, hover lên sáng */}
              <a 
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="group flex h-12 items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-semibold tracking-wide text-white shadow-md transition-all hover:scale-105 hover:bg-white hover:text-primary active:scale-98"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/20 text-white transition-all group-hover:bg-primary/10 group-hover:text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <span>{contactInfo.phone}</span>
              </a>

              {/* 2. Nút Shopee - Nền Cam đậm đà, hover sang Cam đậm, hóa trắng icon cực đẹp */}
              <a 
                href={shopeeShopUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex h-12 items-center gap-2.5 rounded-xl border border-[#EE4D2D] bg-[#EE4D2D] px-5 text-sm font-semibold tracking-wide text-white shadow-md transition-all hover:scale-105 hover:bg-[#D33D1E] hover:border-[#D33D1E] active:scale-98"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/20 transition-all group-hover:bg-white/30">
                  <Image 
                    src="/icons/shopee.svg" 
                    alt="Shopee" 
                    width={16} 
                    height={16} 
                    className="object-contain transition-all duration-300 brightness-0 invert"
                  />
                </div>
                <span>Mua tại Shopee</span>
              </a>

              {/* 3. Nút GrabMart - Nền Xanh Lá Grab, hover đổi màu nền đậm hơn (như cơ chế nút gọi điện của ContactCTA), giữ nguyên logo chuẩn */}
              <a 
                href={grabMartUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex h-12 items-center gap-2.5 rounded-xl border border-[#00B14F] bg-[#00B14F] px-5 text-sm font-semibold tracking-wide text-white shadow-md transition-all hover:scale-105 hover:bg-[#00913F] hover:border-[#00913F] active:scale-98"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-white/20 transition-all group-hover:bg-white/30">
                  <Image 
                    src="/icons/grabmart.svg" 
                    alt="GrabMart" 
                    width={16} 
                    height={16} 
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span>Mua tại GrabMart</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
