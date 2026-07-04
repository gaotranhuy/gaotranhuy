import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Wheat,
  Sparkles,
  Leaf,
  Sprout,
  Droplet,
  ShoppingBasket,
} from "lucide-react";

import {
  getAllCategories,
  getCategoryProductCount,
} from "@/lib/supabase-data";
import { SectionHeading } from "@/components/common/section-heading";

const icons = {
  Wheat,
  Sparkles,
  Leaf,
  Sprout,
  Droplet,
  ShoppingBasket,
};

export async function CategorySection() {
  const categories = getAllCategories();

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      count: await getCategoryProductCount(cat.slug),
    }))
  );

  return (
    <section className="py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Danh mục"
          title="Khám phá theo danh mục"
          description="Đầy đủ các dòng gạo, thực phẩm và đặc sản chất lượng."
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categoriesWithCount.map((cat) => {
            const Icon = icons[cat.icon as keyof typeof icons] ?? Wheat;

            return (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="group rounded-2xl border bg-card p-4 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="80px"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="rounded-full bg-white/90 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>

                <h3 className="text-center text-sm font-semibold">
                  {cat.name}
                </h3>

                <p className="mt-1 text-center text-xs text-muted-foreground">
                  {cat.count} sản phẩm
                </p>

                <ArrowRight className="mx-auto mt-3 h-4 w-4 text-primary opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
