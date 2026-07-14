import Image from 'next/image';
import { Phone, MapPin } from 'lucide-react';
import { contactInfo } from '@/data/site';

export function ContactCTA() {
  const shopeeShopUrl = contactInfo.shopee;
  const grabMartUrl = contactInfo.grabMart;
  const googleMapUrl = `https://maps.google.com/`;

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Nút Gọi ngay */}
          <a 
            href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Gọi ngay</div>
              <div className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {contactInfo.phone}
              </div>
            </div>
          </a>

          {/* Nút GrabMart - UI Đã cải tiến siêu sạch */}
          <a 
            href={grabMartUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-[#00B14F] hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-100 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-[#00B14F]/30">
              <Image 
                src="/icons/grabmart.svg" 
                alt="GrabMart" 
                width={26} 
                height={26} 
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">GrabMart</div>
              <div className="text-base font-semibold text-foreground transition-colors group-hover:text-[#00B14F]">
                Đặt GrabMart giao nhanh
              </div>
            </div>
          </a>

          {/* Nút Shopee - UI Đã cải tiến siêu sạch */}
          <a 
            href={shopeeShopUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-[#EE4D2D] hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-100 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:border-[#EE4D2D]/30">
              <Image 
                src="/icons/shopee.svg" 
                alt="Shopee" 
                width={26} 
                height={26} 
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Shopee</div>
              <div className="text-base font-semibold text-foreground transition-colors group-hover:text-[#EE4D2D]">
                Đặt Shopee giao toàn quốc
              </div>
            </div>
          </a>

          {/* Địa chỉ */}
          <a 
            href={googleMapUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Địa chỉ</div>
              <div className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {contactInfo.address}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
