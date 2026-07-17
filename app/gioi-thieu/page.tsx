import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wheat,
  ShieldCheck,
  HeartHandshake,
  Truck,
  Award,
  Leaf,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { Button } from '@/components/ui/button';
import { CTASection } from '@/components/home/cta-section';
import { siteSettings } from '@/data/site';
import { cloudinaryBanner } from '@/lib/cloudinary';

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description:
    'Gạo Trần Huy - Cửa hàng chuyên cung cấp gạo thơm dẻo, nước mắm nhĩ Nam Ô, dầu lạc nguyên chất và đặc sản nông sản Việt Nam.',
  alternates: { canonical: '/gioi-thieu' },
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Chất lượng thật',
    desc: 'Cam kết 100% gạo thật, nguồn gốc rõ ràng, không tẩm ướp hóa chất.',
  },
  {
    icon: HeartHandshake,
    title: 'Tận tâm phục vụ',
    desc: 'Luôn đặt lợi ích khách hàng lên hàng đầu, tư vấn nhiệt tình.',
  },
  {
    icon: Truck,
    title: 'Giao hàng nhanh',
    desc: 'Giao hàng toàn quốc 24h, đóng gói cẩn thận, giữ trọn chất lượng.',
  },
  {
    icon: Leaf,
    title: 'Sản phẩm sạch',
    desc: 'Tuyển chọn từ vùng trồng trọt uy tín, an toàn cho sức khỏe.',
  },
];

const milestones = [
  { year: '2015', title: 'Khởi nghiệp', desc: 'Bắt đầu từ một tiệm gạo nhỏ' },
  { year: '2018', title: 'Mở rộng', desc: 'Thêm nước mắm Nam Ô, dầu lạc' },
  { year: '2021', title: 'Online', desc: 'Bán hàng online, giao toàn quốc' },
  { year: '2024', title: 'Phát triển', desc: '16+ sản phẩm, 1.000+ khách hàng' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Về chúng tôi"
        title="Gạo Trần Huy - Hương vị quê nhà"
        description="Chúng tôi tự hào mang đến những sản phẩm gạo, nước mắm và dầu lạc chất lượng cao từ các vùng đất trù phú Việt Nam."
      />

      <div className="container-page py-8">
        <Breadcrumb items={[{ name: 'Giới thiệu' }]} className="mb-8" />

        {/* Story */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={cloudinaryBanner('https://images.pexels.com/photos/7421205/pexels-photo-7421205.jpeg')}
              alt="Gạo Trần Huy"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Wheat className="h-3.5 w-3.5" />
              Câu chuyện
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
              Từ những cánh đồng lúa...
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/80">
              <p>
                {siteSettings.name} bắt đầu từ một tiệm gạo nhỏ, với mong muốn
                mang đến cho người tiêu dùng những sản phẩm gạo thật, chất lượng,
                nguồn gốc rõ ràng. Chúng tôi tin rằng mỗi bữa cơm gia đình đều
                xứng đáng có những hạt gạo thơm dẻo nhất.
              </p>
              <p>
                Trải qua nhiều năm, chúng tôi mở rộng danh mục sản phẩm: từ gạo
                bình dân, gạo đặc sản, gạo nếp, gạo lứt đến nước mắm nhĩ Nam Ô
                truyền thống và dầu lạc nguyên chất. Tất cả đều được tuyển chọn
                kỹ lưỡng từ những vùng đất trù phú nhất Việt Nam.
              </p>
              <p>
                Chúng tôi cam kết mang đến sản phẩm chất lượng, giá hợp lý và
                dịch vụ tận tâm. Mỗi khách hàng của Gạo Trần Huy đều là một người
                bạn đồng hành trên hành trình mang hương vị quê nhà đến mọi bữa
                cơm.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Award className="h-3.5 w-3.5" />
              Giá trị cốt lõi
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
              Điều chúng tôi tin
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Hành trình
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
              Cột mốc phát triển
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className="relative rounded-2xl border bg-card p-5"
              >
                <div className="absolute right-4 top-4 font-display text-3xl font-extrabold text-primary/20">
                  0{i + 1}
                </div>
                <div className="text-sm font-bold text-primary">{m.year}</div>
                <h3 className="mt-1 text-base font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <Link href="/san-pham">
              Khám phá sản phẩm
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CTASection />
    </>
  );
}
