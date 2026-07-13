import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase-server';

const SHEET_ID = '10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA';

interface GvizRow {
  values: { v: unknown }[];
}

interface GvizResponse {
  table: {
    cols: { label: string; id: string }[];
    rows: GvizRow[];
  };
}

async function fetchSheetTab(
  tabName: string
): Promise<{ headers: string[]; rows: string[][] }> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet tab "${tabName}": ${response.status}`);
  }

  const text = await response.text();
  const jsonStr = text
    .replace(/^\)\]\}'?\s*\n?\s*google\.visualization\.Query\.setResponse\(/, '')
    .replace(/\);?\s*$/, '');
  const data: GvizResponse = JSON.parse(jsonStr);

  const headers = (data.table?.cols || []).map((c) =>
    (c.label || c.id || '').trim()
  );
  const rawRows = data.table?.rows || [];

  const rows: string[][] = rawRows.map((row) =>
    headers.map((_, i) => {
      const cell = row.values?.[i];
      if (cell == null) return '';
      const v = (cell as { v: unknown }).v;
      if (v == null) return '';
      return String(v).trim();
    })
  );

  return { headers, rows };
}

function pick(
  parsed: Record<string, string>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const v = parsed[key];
    if (v !== undefined && v.trim() !== '') return v.trim();
  }
  return '';
}

function parseTags(val: string): string[] {
  if (!val || !val.trim()) return [];
  const sep = val.includes('|') ? '|' : val.includes('\n') ? '\n' : ',';
  return val
    .split(sep === ',' ? /[,;]/ : sep)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseNumber(val: string): number {
  if (!val || !val.trim()) return 0;
  const num = parseFloat(val.replace(/[^\d.-]/g, ''));
  return isNaN(num) ? 0 : Math.round(num);
}

function parseFloat2(val: string): number {
  if (!val || !val.trim()) return 0;
  const num = parseFloat(val.replace(/[^\d.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

function cleanString(val: string): string | null {
  const t = val.trim();
  return t === '' ? null : t;
}

function cleanBool(val: string, fallback: boolean): boolean {
  if (val === undefined || val === null || val.trim() === '') return fallback;
  const v = val.trim().toLowerCase();
  if (['true', '1', 'yes', 'co', 'c\u00f3', 'c\u00f2n h\u00e0ng', 'con hang', 'x', 'v'].includes(v))
    return true;
  if (['false', '0', 'no', 'kh\u00f4ng', 'het hang', 'h\u1ebft h\u00e0ng'].includes(v))
    return false;
  return fallback;
}

function parseNutritionFacts(
  val: string
): { label: string; value: string }[] {
  if (!val || !val.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(val);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { label: string; value: string } =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).label === 'string' &&
        typeof (item as Record<string, unknown>).value === 'string'
    );
  } catch {
    return [];
  }
}

function isBlankRow(row: string[]): boolean {
  return row.every((cell) => !cell || !cell.trim());
}

function revalidateProductPages() {
  revalidatePath('/', 'layout');
  revalidatePath('/san-pham', 'layout');
  revalidatePath('/danh-muc/[slug]', 'page');
  revalidatePath('/san-pham/[slug]', 'page');
  revalidatePath('/tin-tuc', 'layout');
  revalidatePath('/tin-tuc/[slug]', 'page');
  revalidatePath('/sitemap');
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Kh\u00f4ng c\u00f3 quy\u1ec1n truy c\u1eadp' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const syncProducts = body.products !== false;
    const syncBlog = body.blog !== false;
    const supabase = getSupabase();
    const results = {
      products: 0,
      blog: 0,
      errors: [] as string[],
      skipped: 0,
    };

    // ── Products sync (tab "sp") ──────────────────────────────
    if (syncProducts) {
      try {
        const { headers, rows } = await fetchSheetTab('sp');

        console.log('[sync-sheet] Products headers:', headers);
        console.log('[sync-sheet] Products row count:', rows.length);

        if (rows.length === 0) {
          results.errors.push('Sheet "sp" kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u');
        } else {
          const dataRows = rows.filter((r) => !isBlankRow(r));

          for (const row of dataRows) {
            const parsed: Record<string, string> = {};
            headers.forEach((h, i) => {
              parsed[h.trim()] = (row[i] ?? '').trim();
            });

            console.log('[sync-sheet] Raw row parsed:', JSON.stringify(parsed));

            const productId = cleanString(
              pick(parsed, 'id', 'ID', 'product_id')
            );
            const productSlug = cleanString(
              pick(parsed, 'slug', 'Slug')
            );
            const productName = cleanString(
              pick(parsed, 'name', 'Name', 't\u00ean', 'ten_san_pham', 'product_name')
            );

            if (!productId) {
              results.errors.push('Skipped row: missing id');
              results.skipped++;
              continue;
            }
            if (!productName || !productSlug) {
              results.errors.push(
                `Skipped ${productId}: missing name or slug`
              );
              results.skipped++;
              continue;
            }

            // in_stock: try multiple column name variants
            const inStockRaw = pick(
              parsed,
              'in_stock',
              'inStock',
              'in stock',
              'stock',
              'con_hang',
              'c\u00f2n h\u00e0ng',
              'ton_kho'
            );

            const productData = {
              id: productId,
              slug: productSlug,
              name: productName,

              category_slug: cleanString(
                pick(parsed, 'category_slug', 'categorySlug', 'category', 'danh_muc', 'danh m\u1ee5c')
              ) ?? '',

              short_description: cleanString(
                pick(parsed, 'short_description', 'shortDescription', 'mo_ta_ngan', 'm\u00f4 t\u1ea3 ng\u1eafn')
              ) ?? '',

              description: cleanString(
                pick(parsed, 'description', 'mo_ta', 'mo ta', 'm\u00f4 t\u1ea3')
              ) ?? '',

              origin: cleanString(
                pick(parsed, 'origin', 'xuat_xu', 'xu\u1ea5t x\u1ee9', 'ngu\u1ed3n g\u1ed1c')
              ) ?? '',

              weight: cleanString(
                pick(parsed, 'weight', 'trong_luong', 'tr\u1ecdng l\u01b0\u1ee3ng', 'kl')
              ) ?? '',

              price: parseNumber(
                pick(parsed, 'price', 'gia', 'gi\u00e1', 'don_gia')
              ),

              old_price: (function () {
                const v = pick(parsed, 'old_price', 'oldPrice', 'gia_cu', 'gi\u00e1 c\u0169', 'compare_price');
                if (!v) return null;
                const n = parseNumber(v);
                return n > 0 ? n : null;
              })(),

              unit: cleanString(
                pick(parsed, 'unit', 'don_vi', '\u0111\u01a1n v\u1ecb')
              ) ?? '',

              image: cleanString(
                pick(parsed, 'image', 'anh', '\u1ea3nh', 'hinh', 'h\u00ecnh', 'image_url', 'thumbnail')
              ) ?? '',

              gallery: parseTags(
                pick(parsed, 'gallery', 'album', 'images', 'anh_phu', '\u1ea3nh ph\u1ee5')
              ),

              features: parseTags(
                pick(parsed, 'features', 'dac_diem', '\u0111\u1eb7c \u0111i\u1ec3m', 'tinh_nang', 'dac_tinh')
              ),

              nutrition_facts: parseNutritionFacts(
                pick(parsed, 'nutrition_facts', 'nutritionFacts', 'dinh_duong', 'dinh d\u01b0\u1ee1ng')
              ),

              tags: parseTags(
                pick(parsed, 'tags', 'tag', 'tu_khoa', 't\u1eeb kh\u00f3a')
              ),

              shopee_url: cleanString(
                pick(parsed, 'shopee_url', 'shopeeUrl', 'shopee', 'link_shopee')
              ),

              rating: parseFloat2(
                pick(parsed, 'rating', 'danh_gia', '\u0111\u00e1nh gi\u00e1')
              ),

              review_count: parseNumber(
                pick(parsed, 'review_count', 'reviewCount', 'so_danh_gia', 'reviews')
              ),

              sold_count: parseNumber(
                pick(parsed, 'sold_count', 'soldCount', 'da_ban', 'so_ban', 'sold')
              ),

              in_stock: cleanBool(inStockRaw, true),

              is_featured: cleanBool(
                pick(parsed, 'is_featured', 'isFeatured', 'featured', 'noi_bat', 'n\u1ed5i b\u1eadt'),
                false
              ),

              is_best_seller: cleanBool(
                pick(parsed, 'is_best_seller', 'isBestSeller', 'best_seller', 'ban_chay', 'b\u00e1n ch\u1ea1y'),
                false
              ),

              is_new: cleanBool(
                pick(parsed, 'is_new', 'isNew', 'new', 'moi', 'm\u1edbi'),
                false
              ),
            };

            console.log(
              `[sync-sheet] Mapped product ${productId}:`,
              JSON.stringify({
                name: productData.name,
                category_slug: productData.category_slug,
                price: productData.price,
                old_price: productData.old_price,
                in_stock: productData.in_stock,
                weight: productData.weight,
                gallery_count: productData.gallery.length,
                features_count: productData.features.length,
              })
            );

            const { error } = await supabase
              .from('products')
              .upsert(productData, { onConflict: 'id' });

            if (error) {
              console.error(
                `[sync-sheet] DB error for product ${productId}:`,
                error.message
              );
              results.errors.push(`Product ${productId}: ${error.message}`);
            } else {
              console.log(`[sync-sheet] Upserted product ${productId} OK`);
              results.products++;
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown';
        console.error('[sync-sheet] Products sync error:', msg);
        results.errors.push(`Products sync error: ${msg}`);
      }
    }

    // ── Blog sync (tab "blog") ────────────────────────────────
    if (syncBlog) {
      try {
        const { headers, rows } = await fetchSheetTab('blog');

        console.log('[sync-sheet] Blog headers:', headers);
        console.log('[sync-sheet] Blog row count:', rows.length);

        if (rows.length === 0) {
          results.errors.push('Sheet "blog" kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u');
        } else {
          const dataRows = rows.filter((r) => !isBlankRow(r));

          for (const row of dataRows) {
            const parsed: Record<string, string> = {};
            headers.forEach((h, i) => {
              parsed[h.trim()] = (row[i] ?? '').trim();
            });

            const blogId = cleanString(pick(parsed, 'id', 'ID'));
            const blogSlug = cleanString(pick(parsed, 'slug', 'Slug'));
            const blogTitle = cleanString(
              pick(parsed, 'title', 'tieu_de', 'ti\u00eau \u0111\u1ec1')
            );

            if (!blogId) {
              results.errors.push('Skipped blog row: missing id');
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
              excerpt: cleanString(pick(parsed, 'excerpt', 'tom_tat', 't\u00f3m t\u1eaft')) ?? '',
              content: cleanString(pick(parsed, 'content', 'noi_dung', 'n\u1ed9i dung')) ?? '',
              category: cleanString(pick(parsed, 'category', 'danh_muc', 'danh m\u1ee5c')) ?? '',
              image: cleanString(pick(parsed, 'image', 'anh', 'h\u00ecnh')) ?? '',
              author: cleanString(pick(parsed, 'author', 'tac_gia', 't\u00e1c gi\u1ea3')) ?? 'G\u1ea1o Tr\u1ea7n Huy',
              published_at:
                cleanString(pick(parsed, 'published_at', 'date', 'ngay', 'ng\u00e0y')) ??
                new Date().toISOString().split('T')[0],
              reading_time: parseNumber(pick(parsed, 'reading_time', 'readTime', 'doc_phat')) || 5,
              tags: parseTags(pick(parsed, 'tags', 'tag', 'tu_khoa')),
            };

            const { error } = await supabase
              .from('blog_posts')
              .upsert(postData, { onConflict: 'id' });

            if (error) {
              console.error(`[sync-sheet] Blog ${blogId} error:`, error.message);
              results.errors.push(`Blog ${blogId}: ${error.message}`);
            } else {
              results.blog++;
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown';
        console.error('[sync-sheet] Blog sync error:', msg);
        results.errors.push(`Blog sync error: ${msg}`);
      }
    }

    revalidateProductPages();

    console.log('[sync-sheet] Final results:', JSON.stringify(results));

    return NextResponse.json({ success: true, ...results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'L\u1ed7i server';
    console.error('[sync-sheet] Unhandled error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Kh\u00f4ng c\u00f3 quy\u1ec1n truy c\u1eadp' },
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
      { error: err instanceof Error ? err.message : 'L\u1ed7i server' },
      { status: 500 }
    );
  }
}
