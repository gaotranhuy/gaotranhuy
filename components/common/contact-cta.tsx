import { Phone, MessageCircle, MapPin, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo } from '@/data/site';

export function ContactCTA() {
  // Đường dẫn đến shop gaotranhuy trên Shopee
  const shopeeShopUrl = `https://shopee.vn/gaotranhuy`;
  
  // Đường dẫn Google Maps của bạn
  const googleMapUrl = `https://maps.google.com/`;

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Nút Gọi ngay */}
          <a
            href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Gọi ngay</div>
              <div className="text-base font-semibold">{contactInfo.phone}</div>
            </div>
          </a>

          {/* Nút Chat Zalo */}
          <a
            href={`https://zalo.me/${contactInfo.zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Chat Zalo</div>
              <div className="text-base font-semibold">Đặt Zalo Giao Nhanh Đà Nẵng</div>
            </div>
          </a>

          {/* Nút Shopee Giao hàng toàn quốc */}
          <a
            href={shopeeShopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-[#EE4D2D]/30 bg-card p-5 transition-all hover:border-[#EE4D2D] hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EE4D2D]/10 text-[#EE4D2D] transition-colors group-hover:bg-[#EE4D2D] group-hover:text-white">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Shopee</div>
              <div className="text-base font-semibold text-[#EE4D2D] group-hover:text-[#EE4D2D]">
                Đặt Shopee Giao hàng toàn quốc
              </div>
            </div>
          </a>

          {/* Khối Địa chỉ - Đã được chuyển đổi sang thẻ <a> để click mở Google Maps */}
          <a
            href={googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Địa chỉ</div>
              <div className="line-clamp-1 text-sm font-semibold">
                {contactInfo.address}
              </div>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
