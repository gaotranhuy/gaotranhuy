import Image from 'next/image';
import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
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
              <Button asChild size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90 h-12 rounded-xl text-sm font-semibold tracking-wide">
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                  <Phone className="h-5 w-5 mr-1.5" />
                  {contactInfo.phone}
                </a>
              </Button>
              <Button asChild size="lg" className="bg-[#00B14F] text-white hover:bg-[#009a44] border-none shadow-md h-12 rounded-xl text-sm font-semibold tracking-wide active:scale-98 transition-transform">
                <a href={grabMartUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Image 
                    src="/icons/grabmart.svg" 
                    alt="GrabMart" 
                    width={20} 
                    height={20} 
                    className="object-contain"
                  />
                  Mua tại GrabMart
                </a>
              </Button>
              <Button asChild size="lg" className="bg-[#EE4D2D] text-white hover:bg-[#ff5733] border-none shadow-md h-12 rounded-xl text-sm font-semibold tracking-wide active:scale-98 transition-transform">
                <a href={shopeeShopUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Image 
                    src="/icons/shopee.svg" 
                    alt="Shopee" 
                    width={20} 
                    height={20} 
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
