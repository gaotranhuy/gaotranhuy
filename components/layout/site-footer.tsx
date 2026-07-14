import Link from 'next/link';
import Image from 'next/image';
import {
  Phone, Mail, MapPin, Clock,
  ShieldCheck, Truck, Headphones, BadgeCheck,
} from 'lucide-react';
import { contactInfo, siteSettings } from '@/data/site';
import { getAllCategories } from '@/lib/products';

const GRAB_MART_URL = 'https://r.grab.com/o/BFr2qEfa';

const features = [
  { icon: Truck, title: 'Giao hàng toàn quốc', desc: 'Miễn phí đơn từ 500.000đ' },
  { icon: ShieldCheck, title: 'Cam kết chất lượng', desc: '100% gạo thật, nguồn gốc rõ ràng' },
  { icon: Headphones, title: 'Hỗ trợ tận tâm', desc: 'Tư vấn 7:00 - 20:00 mỗi ngày' },
  { icon: BadgeCheck, title: 'Thanh toán linh hoạt', desc: 'Tiền mặt, chuyển khoản, GrabMart' },
];

const policyLinks = [
  { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
  { href: '/chinh-sach-giao-hang', label: 'Chính sách giao hàng' },
  { href: '/chinh-sach-thanh-toan', label: 'Chính sách thanh toán' },
  { href: '/chinh-sach-doi-tra', label: 'Chính sách đổi trả' },
  { href: '/chinh-sach-kiem-hang', label: 'Chính sách kiểm hàng' },
  { href: '/dieu-khoan-su-dung', label: 'Điều khoản sử dụng' },
  { href: '/huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
];

const socialLinks = [
  { href: contactInfo.facebook, label: 'Facebook', icon: '/icons/facebook.svg' },
  { href: `https://zalo.me/${contactInfo.zalo}`, label: 'Zalo', icon: '/icons/zalo.svg' },
  { href: contactInfo.shopee, label: 'Shopee', icon: '/icons/shopee.svg' },
  { href: GRAB_MART_URL, label: 'GrabMart', icon: '/icons/grabmart.svg' },
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
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-transparent p-1">
              <img src="/logo-brand1.png" alt="Gạo Trần Huy Logo" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold">Gạo Trần Huy</span>
              <span className="text-[11px] text-background/60">{siteSettings.tagline}</span>
            </div>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-background/70">{siteSettings.description}</p>
          {/* Social icons - 4 on same row */}
          <div className="mt-5 flex gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10 transition-all hover:bg-background/20 hover:scale-105"
              >
                <Image src={s.icon} alt={s.label} width={22} height={22} className="object-contain" />
              </a>
            ))}
          </div>
          {/* Bo Cong Thuong badge */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
            <Image
              src="/icons/bo-cong-thuong.png"
              alt="Đã thông báo Bộ Công Thương"
              width={170}
              height={64}
              className="w-[140px] md:w-[170px] h-auto"
            />
          </a>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Danh mục</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/danh-muc/${cat.slug}`} className="text-background/70 transition-colors hover:text-primary">{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links + Policy */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Liên kết</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/san-pham" className="text-background/70 transition-colors hover:text-primary">Tất cả sản phẩm</Link></li>
            <li><Link href="/gioi-thieu" className="text-background/70 transition-colors hover:text-primary">Giới thiệu</Link></li>
            <li><Link href="/tin-tuc" className="text-background/70 transition-colors hover:text-primary">Tin tức</Link></li>
            <li><Link href="/lien-he" className="text-background/70 transition-colors hover:text-primary">Liên hệ</Link></li>
            <li><Link href="/gio-hang" className="text-background/70 transition-colors hover:text-primary">Giỏ hàng</Link></li>
            <li><Link href="/dat-hang" className="text-background/70 transition-colors hover:text-primary">Đặt hàng</Link></li>
          </ul>
          <h3 className="mb-4 mt-6 text-sm font-semibold uppercase tracking-wider">Chính sách</h3>
          <ul className="space-y-2.5 text-sm">
            {policyLinks.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-background/70 transition-colors hover:text-primary">{p.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Liên hệ</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-background/70">{contactInfo.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-background/70 transition-colors hover:text-primary">{contactInfo.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${contactInfo.email}`} className="text-background/70 transition-colors hover:text-primary">{contactInfo.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-background/70">{contactInfo.workingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Gạo Trần Huy. Tất cả quyền được bảo lưu.</p>
          <p>Thiết kế bởi <span className="font-medium text-background/80">Gạo Trần Huy Team</span></p>
        </div>
      </div>
    </footer>
  );
}
