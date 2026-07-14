import Link from 'next/link';
import {
  Wheat,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Send,
  ShieldCheck,
  Truck,
  Headphones,
  BadgeCheck,
} from 'lucide-react';
import { contactInfo, siteSettings } from '@/data/site';
import { getAllCategories } from '@/lib/products';
import Image from 'next/image';
const features = [
  {
    icon: Truck,
    title: 'Giao hàng toàn quốc',
    desc: 'Miễn phí đơn từ 500.000đ',
  },
  {
    icon: ShieldCheck,
    title: 'Cam kết chất lượng',
    desc: '100% gạo thật, nguồn gốc rõ ràng',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ tận tâm',
    desc: 'Tư vấn 7:00 - 20:00 mỗi ngày',
  },
  {
    icon: BadgeCheck,
    title: 'Thanh toán linh hoạt',
    desc: 'Tiền mặt, chuyển khoản, Zalo',
  },
];

export function SiteFooter() {
  const categories = getAllCategories();

  return (
    <footer className="mt-20 border-t bg-foreground text-background">
      {/* Features bar */}
      <div className="border-b border-background/10">
        <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-background/60">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Khối ôm ảnh logo tự động thu nhỏ vừa vặn tương tự site header */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-transparent p-1">
              <img 
                src="/logo-brand1.png" 
                alt="Gạo Trần Huy Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold">
                Gạo Trần Huy
              </span>
              <span className="text-[11px] text-background/60">
                {siteSettings.tagline}
              </span>
            </div>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-background/70">
            {siteSettings.description}
          </p>
    <div className="mt-5 flex gap-2">
  <a
    href={contactInfo.facebook}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 transition-all hover:bg-background/20 hover:scale-105"
  >
    <Image
      src="/icons/facebook.svg"
      alt="Facebook"
      width={22}
      height={22}
      className="object-contain"
    />
  </a>

  <a
    href={`https://zalo.me/${contactInfo.zalo}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Zalo"
    className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 transition-all hover:bg-background/20 hover:scale-105"
  >
    <Image
      src="/icons/zalo.svg"
      alt="Zalo"
      width={22}
      height={22}
      className="object-contain"
    />
  </a>
</div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Danh mục
          </h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/danh-muc/${cat.slug}`}
                  className="text-background/70 transition-colors hover:text-primary"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Liên kết
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/san-pham"
                className="text-background/70 transition-colors hover:text-primary"
              >
                Tất cả sản phẩm
              </Link>
            </li>
            <li>
              <Link
                href="/gioi-thieu"
                className="text-background/70 transition-colors hover:text-primary"
              >
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link
                href="/tin-tuc"
                className="text-background/70 transition-colors hover:text-primary"
              >
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                href="/lien-he"
                className="text-background/70 transition-colors hover:text-primary"
              >
                Liên hệ
              </Link>
            </li>
            <li>
              <Link
                href="/gio-hang"
                className="text-background/70 transition-colors hover:text-primary"
              >
                Giỏ hàng
              </Link>
            </li>
            <li>
              <Link
                href="/dat-hang"
                className="text-background/70 transition-colors hover:text-primary"
              >
                Đặt hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Liên hệ
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-background/70">{contactInfo.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="text-background/70 transition-colors hover:text-primary"
              >
                {contactInfo.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-background/70 transition-colors hover:text-primary"
              >
                {contactInfo.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-background/70">
                {contactInfo.workingHours}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-background/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Gạo Trần Huy. Tất cả quyền được bảo
            lưu.
          </p>
          <p>
            Thiết kế bởi{' '}
            <span className="font-medium text-background/80">
              Gạo Trần Huy Team
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
