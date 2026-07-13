import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase-server';
import { fetchProductsFromSheet } from '@/lib/google-sheet';
import type { Product } from '@/types';

function revalidateProductPages() {
  revalidatePath('/', 'layout');
  revalidatePath('/san-pham', 'layout');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/san-pham/[slug]', 'page');
  revalidatePath('/sitemap');
}

function productToDbRow(p: Product): Record<string, unknown> {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category_slug: p.categorySlug,
    short_description: p.shortDescription,
    description: p.description,
    origin: p.origin,
    weight: p.weight,
    price: p.price,
    old_price: p.oldPrice ?? null,
    unit: p.unit,
    image: p.image,
    gallery: p.gallery,
    features: p.features,
    nutrition_facts: p.nutritionFacts ?? [],
    tags: p.tags,
    shopee_url: p.shopeeUrl ?? null,
    rating: p.rating,
    review_count: p.reviewCount,
    sold_count: p.soldCount,
    in_stock: p.inStock,
    is_featured: p.isFeatured,
    is_best_seller: p.isBestSeller,
    is_new: p.isNew,
  };
}

export async function POST() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const products = await fetchProductsFromSheet();

    if (products.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const supabase = getSupabase();
    const rows = products.map(productToDbRow);

    const { error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateProductPages();

    return NextResponse.json({ success: true, count: products.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi server';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
