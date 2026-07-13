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
  if (!tagsStr || !tagsStr.trim()) return [];
  return tagsStr
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseNumber(val: string | undefined | null): number {
  if (!val || !val.trim()) return 0;
  const cleaned = val.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

function cleanString(val: string | undefined | null): string | null {
  if (val == null) return null;
  const trimmed = val.trim();
  return trimmed === '' ? null : trimmed;
}

function cleanBool(val: string | undefined | null, fallback: boolean): boolean {
  if (val == null || val.trim() === '') return fallback;
  const v = val.trim().toLowerCase();
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return fallback;
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

            const productId = cleanString(parsed.id);
            const productSlug = cleanString(parsed.slug);
            const productName = cleanString(parsed.name);

            // Skip rows with missing or invalid ID — would break upsert flow
            if (!productId) {
              results.errors.push(`Skipped row: missing or blank ID`);
              continue;
            }
            if (!productName || !productSlug) {
              results.errors.push(`Skipped row ${productId}: missing name or slug`);
              continue;
            }

            const productData = {
              id: productId,
              slug: productSlug,
              name: productName,
              category_slug: cleanString(parsed.category_slug || parsed.categorySlug || parsed.category) || '',
              short_description: cleanString(parsed.short_description || parsed.shortDescription) || '',
              description: cleanString(parsed.description) || '',
              origin: cleanString(parsed.origin) || '',
              weight: cleanString(parsed.weight) || '',
              price: parseNumber(parsed.price),
              old_price: cleanString(parsed.old_price || parsed.oldPrice)
                ? parseNumber(parsed.old_price || parsed.oldPrice)
                : null,
              unit: cleanString(parsed.unit) || '',
              image: cleanString(parsed.image) || '',
              gallery: [] as string[],
              features: parseTags(parsed.features || ''),
              nutrition_facts: [] as unknown[],
              tags: parseTags(parsed.tags || ''),
              rating: parsed.rating && parsed.rating.trim() ? (parseFloat(parsed.rating) || 0) : 0,
              review_count: parseNumber(parsed.review_count || parsed.reviewCount),
              sold_count: parseNumber(parsed.sold_count || parsed.sold),
              in_stock: cleanBool(parsed.in_stock ?? parsed.inStock, true),
              is_featured: cleanBool(parsed.is_featured ?? parsed.isFeatured, false),
              is_best_seller: cleanBool(parsed.is_best_seller ?? parsed.isBestSeller, false),
              is_new: false,
              shopee_url: cleanString(parsed.shopee_url || parsed.shopeeUrl),
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

            const blogId = cleanString(parsed.id);
            const blogSlug = cleanString(parsed.slug);
            const blogTitle = cleanString(parsed.title);

            if (!blogId) {
              results.errors.push(`Skipped blog row: missing or blank ID`);
              continue;
            }
            if (!blogTitle || !blogSlug) {
              results.errors.push(`Skipped blog row ${blogId}: missing title or slug`);
              continue;
            }

            const postData = {
              id: blogId,
              slug: blogSlug,
              title: blogTitle,
              excerpt: cleanString(parsed.excerpt) || '',
              content: cleanString(parsed.content) || '',
              category: cleanString(parsed.category) || '',
              image: cleanString(parsed.image) || '',
              author: cleanString(parsed.author) || 'Gạo Trần Huy',
              published_at: cleanString(parsed.date) || new Date().toISOString().split('T')[0],
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
