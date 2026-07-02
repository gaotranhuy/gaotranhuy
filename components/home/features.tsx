import {
  Truck,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Wheat,
  HeartHandshake,
} from 'lucide-react';

const features = [
  {
    icon: Wheat,
    title: 'Gạo thật 100%',
    desc: 'Cam kết gạo thật, nguồn gốc rõ ràng, không tẩm ướp hóa chất.',
  },
  {
    icon: Truck,
    title: 'Giao hàng toàn quốc',
    desc: 'Giao nhanh 24h, miễn phí giao hàng cho đơn từ 500.000đ.',
  },
  {
    icon: ShieldCheck,
    title: 'Chất lượng đảm bảo',
    desc: 'Sản phẩm được kiểm định, đóng gói chân không, giữ trọn hương vị.',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ tận tâm',
    desc: 'Tư vấn chọn gạo phù hợp, hỗ trợ 7:00 - 20:00 mỗi ngày.',
  },
  {
    icon: BadgeCheck,
    title: 'Thanh toán linh hoạt',
    desc: 'Tiền mặt, chuyển khoản, Zalo - thanh toán tại nhà.',
  },
  {
    icon: HeartHandshake,
    title: 'Đổi trả 24h',
    desc: 'Đổi trả miễn phí trong 24h nếu sản phẩm có vấn đề.',
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group flex items-start gap-4 rounded-2xl border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
