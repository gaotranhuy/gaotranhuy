import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase-server';
import { syncToSheet } from '@/lib/sheet-sync';

function revalidateProductPages() {
  revalidatePath('/', 'layout');
  revalidatePath('/san-pham', 'layout');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/san-pham/[slug]', 'page');
  revalidatePath('/tin-tuc', 'layout');
  revalidatePath('/sitemap');
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    let nextNum = 1;
    if (existing && existing.length > 0) {
      const lastId = existing[0].id;
      const match = lastId.match(/^p(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const newId = `p${String(nextNum).padStart(3, '0')}`;

    const insertData = {
      id: newId,
      slug: body.slug,
      name: body.name,
      category_slug: body.category_slug,
      short_description: body.short_description || '',
      description: body.description || '',
      origin: body.origin || '',
      weight: body.weight || '',
      price: parseInt(String(body.price).replace(/\D/g, ''), 10) || 0,
      old_price: body.old_price
        ? parseInt(String(body.old_price).replace(/\D/g, ''), 10)
        : null,
      unit: body.unit || '',
      image: body.image || '',
      gallery: body.gallery || [],
      features: body.features || [],
      nutrition_facts: body.nutrition_facts || [],
      tags: body.tags || [],
      shopee_url: body.shopee_url || null,
      rating: body.rating || 0,
      review_count: body.review_count || 0,
      sold_count: body.sold_count || 0,
      in_stock: body.in_stock ?? true,
      is_featured: body.is_featured ?? false,
      is_best_seller: body.is_best_seller ?? false,
      is_new: body.is_new ?? false,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateProductPages();
    syncToSheet('upsert', 'product', data as Record<string, unknown>);

    return NextResponse.json({ product: data });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
