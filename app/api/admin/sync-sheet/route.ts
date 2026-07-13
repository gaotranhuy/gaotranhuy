import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase-server';

const SHEET_ID = '10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA';

interface GvizRow {
  values: { v: string }[];
}

interface GvizResponse {
  table: {
    cols: { label: string; id: string }[];
    rows: GvizRow[];
  };
}

async function fetchSheetTab(tabName: string): Promise<{ headers: string[]; rows: string[][] }> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet tab "${tabName}": ${response.status}`);
  }

  const text = await response.text();
  const jsonStr = text.replace(/^\)\]\}'?\s*\n?\s*google\.visualization\.Query\.setResponse\(/, '').replace(/\);?\s*$/, '');
  const data: GvizResponse = JSON.parse(jsonStr);

  const headers = (data.table?.cols || []).map((c) => (c.label || c.id || '').trim());
  const rawRows = data.table?.rows || [];

  const rows: string[][] = rawRows.map((row) => {
    return headers.map((_, i) => {
      const cell = row.values?.[i];
      return cell ? String(cell.v ?? '').trim() : '';
    });
  });

  return { headers, rows };
}

function parseTags(str: string | undefined | null): string[] {
  if (!str || !str.trim()) return [];
  return str
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseNumber(val: string | undefined | null): number {
  if (!val || !val.trim()) return 0;
  const cleaned = val.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num);
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

function isBlankRow(row: string[]): boolean {
  return row.every((cell) => !cell || !cell.trim());
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

    // ── Products sync (tab "sp") ──
    if (syncProducts) {
      try {
        const { headers, rows } = await fetchSheetTab('sp');

        if (rows.length === 0) {
          results.errors.push('Sheet "sp" không có dữ liệu');
        } else {
          // Filter out blank/empty rows at the bottom or interspersed
          const dataRows = rows.filter((r) => !isBlankRow(r));

          for (const row of dataRows) {
            // Map row cells to header keys
            const parsed: Record<string, string> = {};
            headers.forEach((h, i) => {
              parsed[h] = (row[i] || '').trim();
            });

            const productId = cleanString(parsed.id);
            const productSlug = cleanString(parsed.slug);
            const productName = cleanString(parsed.name);

            // Skip rows with missing or blank ID — never generate fallback IDs
            if (!productId) {
              results.errors.push('Skipped product row: missing or blank ID');
              continue;
            }
            if (!productName || !productSlug) {
              results.errors.push(`Skipped product ${productId}: missing name or slug`);
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
              gallery: parseTags(parsed.gallery),
              features: parseTags(parsed.features),
              nutrition_facts: [] as unknown[],
              tags: parseTags(parsed.tags),
              rating: parsed.rating && parsed.rating.trim() ? (parseFloat(parsed.rating) || 0) : 0,
              review_count: parseNumber(parsed.review_count || parsed.reviewCount),
              sold_count: parseNumber(parsed.sold_count || parsed.sold),
              in_stock: cleanBool(parsed.in_stock ?? parsed.inStock, true),
              is_featured: cleanBool(parsed.is_featured ?? parsed.isFeatured, false),
              is_best_seller: cleanBool(parsed.is_best_seller ?? parsed.isBestSeller, false),
              is_new: cleanBool(parsed.is_new ?? parsed.isNew, false),
              shopee_url: cleanString(parsed.shopee_url || parsed.shopeeUrl),
            };

            const { error } = await supabase
              .from('products')
              .upsert(productData, { onConflict: 'id' });

            if (error) {
              results.errors.push(`Product ${productId}: ${error.message}`);
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

    // ── Blog sync (tab "blog") ──
    if (syncBlog) {
      try {
        const { headers, rows } = await fetchSheetTab('blog');

        if (rows.length === 0) {
          results.errors.push('Sheet "blog" không có dữ liệu');
        } else {
          const dataRows = rows.filter((r) => !isBlankRow(r));

          for (const row of dataRows) {
            const parsed: Record<string, string> = {};
            headers.forEach((h, i) => {
              parsed[h] = (row[i] || '').trim();
            });

            const blogId = cleanString(parsed.id);
            const blogSlug = cleanString(parsed.slug);
            const blogTitle = cleanString(parsed.title);

            if (!blogId) {
              results.errors.push('Skipped blog row: missing or blank ID');
              continue;
            }
            if (!blogTitle || !blogSlug) {
              results.errors.push(`Skipped blog ${blogId}: missing title or slug`);
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
              tags: parseTags(parsed.tags),
            };

            const { error } = await supabase
              .from('blog_posts')
              .upsert(postData, { onConflict: 'id' });

            if (error) {
              results.errors.push(`Blog ${blogId}: ${error.message}`);
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
      products: { headers: products.headers, rows: products.rows.length },
      blog: { headers: blog.headers, rows: blog.rows.length },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi server' },
      { status: 500 }
    );
  }
}
