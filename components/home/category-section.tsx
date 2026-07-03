import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Wheat, Sparkles, Leaf, Droplet, ShoppingBasket, Sprout } from 'lucide-react';
import { getAllCategories, getCategoryProductCount } from '@/lib/supabase-data';
import { SectionHeading } from '@/components/common/section-heading';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wheat,
  Sparkles,
  Leaf,
  Sprout,
  Droplet,
  ShoppingBasket,
};

export async function CategorySection() {
  const categories = getAllCategories();

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Danh mục"
          title="Khám phá theo danh mục"
          description="Từ gạo bình dân đến đặc sản cao cấp, từ nước mắm nhĩ đến dầu lạc nguyên chất - tất cả đều có tại Gạo Trần Huy."
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon] ?? Wheat;
            return (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full bg-accent">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-primary shadow">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold leading-tight text-foreground">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  <CategoryCount slug={cat.slug} />
                </p>
                <ArrowRight className="mt-2 h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
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
  return <>{count} SP</>;
}
