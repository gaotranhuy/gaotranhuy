import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo } from '@/data/site';

export function ContactCTA() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="grid gap-4 sm:grid-cols-3">
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
              <div className="text-base font-semibold">Đặt hàng nhanh</div>
            </div>
          </a>
          <div className="group flex items-center gap-4 rounded-2xl border bg-card p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Địa chỉ</div>
              <div className="line-clamp-1 text-sm font-semibold">
                {contactInfo.address}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
