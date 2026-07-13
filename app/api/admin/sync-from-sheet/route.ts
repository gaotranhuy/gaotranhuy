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
  revalidatePath('/tin-tuc', 'layout');
  revalidatePath('/sitemap');
}

function productToDbRow(p: Product): Record<string, unknown> {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category_slug: p.categorySlug,
    short_description: p.shortDescription ?? '',
    description: p.description ?? '',
    origin: p.origin ?? '',
    weight: p.weight ?? '',
    price: p.price,
    old_price: p.oldPrice ?? null,
    unit: p.unit ?? '',
    image: p.image ?? '',
    gallery: p.gallery ?? [],
    features: p.features ?? [],
    nutrition_facts: p.nutritionFacts ?? [],
    tags: p.tags ?? [],
    shopee_url: p.shopeeUrl ?? null,
    rating: p.rating ?? 0,
    review_count: p.reviewCount ?? 0,
    sold_count: p.soldCount ?? 0,
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
        { error: 'Kh\u00f4ng c\u00f3 quy\u1ec1n truy c\u1eadp' },
        { status: 401 }
      );
    }

    console.log('[sync-from-sheet] Starting import from Google Sheets...');

    const products = await fetchProductsFromSheet();
    console.log(`[sync-from-sheet] Fetched ${products.length} products from sheet`);

    if (products.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const supabase = getSupabase();
    const rows = products.map(productToDbRow);

    console.log('[sync-from-sheet] Sample row before upsert:', JSON.stringify(rows[0]));

    const { error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('[sync-from-sheet] Supabase upsert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[sync-from-sheet] Upserted ${products.length} products successfully`);
    revalidateProductPages();

    return NextResponse.json({ success: true, count: products.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'L\u1ed7i server';
    console.error('[sync-from-sheet] Unhandled error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
