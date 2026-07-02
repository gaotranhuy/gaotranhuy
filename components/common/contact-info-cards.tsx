import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { contactInfo } from '@/data/site';

const cards = [
  {
    icon: Phone,
    label: 'Hotline',
    value: contactInfo.phone,
    href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: MessageCircle,
    label: 'Zalo',
    value: 'Chat đặt hàng',
    href: `https://zalo.me/${contactInfo.zalo}`,
    color: 'bg-success/10 text-success',
  },
  {
    icon: Mail,
    label: 'Email',
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: MapPin,
    label: 'Địa chỉ',
    value: contactInfo.address,
    color: 'bg-destructive/10 text-destructive',
  },
  {
    icon: Clock,
    label: 'Giờ làm việc',
    value: contactInfo.workingHours,
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Send,
    label: 'Mạng xã hội',
    value: 'Facebook · TikTok · YouTube',
    color: 'bg-foreground/10 text-foreground',
  },
];

export function ContactInfoCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const content = (
          <div className="group flex items-start gap-4 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-md">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}
            >
              <card.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {card.label}
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {card.value}
              </div>
            </div>
          </div>
        );
        return card.href ? (
          <a
            key={card.label}
            href={card.href}
            target={card.href.startsWith('http') ? '_blank' : undefined}
            rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {content}
          </a>
        ) : (
          <div key={card.label}>{content}</div>
        );
      })}
    </div>
  );
}
