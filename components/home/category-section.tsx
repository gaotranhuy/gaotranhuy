import Link from 'next/link';
import Image from 'next/image';
import { Wheat, Sparkles, Leaf, Droplet, ShoppingBasket, Sprout } from 'lucide-react';
import { getAllCategories, getCategoryProductCount } from '@/lib/supabase-data';
import { SectionHeading } from '@/components/common/section-heading';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wheat, Sparkles, Leaf, Sprout, Droplet, ShoppingBasket,
};

export async function CategorySection() {
  const categories = getAllCategories();

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Danh mục"
          title="Khám phá theo danh mục"
          description="Từ gạo bình dân đến đặc sản cao cấp, từ nước mắm nhĩ đến dầu lạc nguyên chất."
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Wheat;
            return (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="group flex flex-col items-center rounded-xl border bg-card p-4 text-center transition-all duration-200 hover:border-primary hover:shadow-md"
              >
                {/* Phần hình ảnh tối giản */}
                <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Icon nhỏ gọn ở góc hoặc bỏ hẳn nếu đã có ảnh. Ở đây giữ lại icon dạng overlay nhẹ nhàng */}
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Thông tin chữ */}
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <CategoryCount slug={cat.slug} />
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

async function CategoryCount({ slug }: { slug: string }) {
  const count = await getCategoryProductCount(slug);
  return <>{count} sản phẩm</>;
}
