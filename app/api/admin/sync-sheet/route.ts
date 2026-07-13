import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase-server';

const SHEET_ID = '10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA';

interface SheetRow {
  values: string[];
}

interface SheetResponse {
  valueRanges?: {
    valueRanges?: { values: string[][] }[];
  };
  values?: string[][];
}

async function fetchSheetTab(tabName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${tabName}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet tab: ${tabName}`);
  }

  const text = await response.text();
  const jsonStr = text.replace(/.*\(/, '').replace(/\);$/, '');
  const data = JSON.parse(jsonStr);

  return (data.table?.rows || [])
    .map((row: SheetRow) => row.values?.map((v) => v || '') || [])
    .filter((row: string[]) => row.length > 0);
}

function parseProductRow(headers: string[], row: string[]): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((h, i) => {
    obj[h.trim()] = (row[i] || '').trim();
  });
  return obj;
}

function parseTags(tagsStr: string): string[] {
  if (!tagsStr) return [];
  return tagsStr
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseNumber(val: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const syncProducts = body.products !== false;
    const syncBlog = body.blog !== false;

    const supabase = getSupabase();
    const results = { products: 0, blog: 0, errors: [] as string[] };

    if (syncProducts) {
      try {
        const rows = await fetchSheetTab('sp');
        if (rows.length < 2) {
          results.errors.push('Sheet "sp" không có dữ liệu');
        } else {
          const headers = rows[0];
          const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim()));

          for (const row of dataRows) {
            const parsed = parseProductRow(headers, row);

            const productData = {
              id: parsed.id || `p${Date.now()}`,
              slug: parsed.slug || '',
              name: parsed.name || '',
              category_slug: parsed.categorySlug || parsed.category || '',
              short_description: parsed.shortDescription || '',
              description: parsed.description || '',
              origin: parsed.origin || '',
              weight: parsed.weight || '',
              price: parseNumber(parsed.price),
              old_price: parsed.oldPrice ? parseNumber(parsed.oldPrice) : null,
              unit: parsed.unit || '',
              image: parsed.image || '',
              gallery: [] as string[],
              features: parseTags(parsed.features || ''),
              nutrition_facts: [] as unknown[],
              tags: parseTags(parsed.tags || ''),
              rating: parseFloat(parsed.rating) || 0,
              review_count: parseNumber(parsed.reviewCount || parsed.sold || '0'),
              sold_count: parseNumber(parsed.sold || '0'),
              in_stock: parsed.inStock !== 'false' && parsed.inStock !== '0',
              is_featured: parsed.isFeatured === 'true' || parsed.isFeatured === '1',
              is_best_seller: parsed.isBestSeller === 'true' || parsed.isBestSeller === '1',
              is_new: false,
              shopee_url: parsed.shopeeUrl || parsed.shopee_url || '', 
            };

            const { error } = await supabase
              .from('products')
              .upsert(productData, { onConflict: 'id' });

            if (error) {
              results.errors.push(`Product ${productData.id}: ${error.message}`);
            } else {
              results.products++;
            }
          }
        }
      } catch (err) {
        results.errors.push(
          `Products sync error: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }
    }

    if (syncBlog) {
      try {
        const rows = await fetchSheetTab('blog');
        if (rows.length < 2) {
          results.errors.push('Sheet "blog" không có dữ liệu');
        } else {
          const headers = rows[0];
          const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim()));

          for (const row of dataRows) {
            const parsed = parseProductRow(headers, row);

            const postData = {
              id: parsed.id || `b${Date.now()}`,
              slug: parsed.slug || '',
              title: parsed.title || '',
              excerpt: parsed.excerpt || '',
              content: parsed.content || '',
              category: parsed.category || '',
              image: parsed.image || '',
              author: parsed.author || 'Gạo Trần Huy',
              published_at: parsed.date || new Date().toISOString().split('T')[0],
              reading_time: parseInt(parsed.readTime || '5', 10) || 5,
              tags: parseTags(parsed.tags || ''),
            };

            const { error } = await supabase
              .from('blog_posts')
              .upsert(postData, { onConflict: 'id' });

            if (error) {
              results.errors.push(`Blog ${postData.id}: ${error.message}`);
            } else {
              results.blog++;
            }
          }
        }
      } catch (err) {
        results.errors.push(
          `Blog sync error: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }
    }

    revalidatePath('/', 'layout');
    revalidatePath('/san-pham', 'layout');
    revalidatePath('/danh-muc/[slug]', 'page');
    revalidatePath('/san-pham/[slug]', 'page');
    revalidatePath('/tin-tuc', 'layout');
    revalidatePath('/tin-tuc/[slug]', 'page');
    revalidatePath('/sitemap');

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const products = await fetchSheetTab('sp');
    const blog = await fetchSheetTab('blog');

    return NextResponse.json({
      products: { headers: products[0] || [], rows: products.length - 1 },
      blog: { headers: blog[0] || [], rows: blog.length - 1 },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi server' },
      { status: 500 }
    );
  }
}
