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
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              {/* Nút Gọi Hotline */}
              <Button asChild size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90 h-12 rounded-xl text-sm font-semibold tracking-wide transition-all hover:scale-105 hover:shadow-md">
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                  <Phone className="h-5 w-5 mr-1.5" />
                  {contactInfo.phone}
                </a>
              </Button>
              
              {/* Nút GrabMart - UI Premium Nền Trắng, Chữ Xanh */}
              <Button asChild size="lg" className="bg-white text-[#00B14F] hover:bg-white border border-[#00B14F]/20 shadow-md h-12 rounded-xl text-sm font-semibold tracking-wide transition-all hover:scale-105 hover:shadow-lg hover:border-[#00B14F]/40 active:scale-98">
                <a href={grabMartUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Image 
                    src="/icons/grabmart.svg" 
                    alt="GrabMart" 
                    width={22} 
                    height={22} 
                    className="object-contain"
                  />
                  Mua tại GrabMart
                </a>
              </Button>

              {/* Nút Shopee - UI Premium Nền Trắng, Chữ Cam Đỏ */}
              <Button asChild size="lg" className="bg-white text-[#EE4D2D] hover:bg-white border border-[#EE4D2D]/20 shadow-md h-12 rounded-xl text-sm font-semibold tracking-wide transition-all hover:scale-105 hover:shadow-lg hover:border-[#EE4D2D]/40 active:scale-98">
                <a href={shopeeShopUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Image 
                    src="/icons/shopee.svg" 
                    alt="Shopee" 
                    width={22} 
                    height={22} 
                    className="object-contain"
                  />
                  Mua tại Shopee
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
