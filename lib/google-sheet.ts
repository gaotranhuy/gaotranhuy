import { google } from 'googleapis';
import type { Product } from '@/types';

const SHEET_ID =
  process.env.GOOGLE_SHEET_ID || '10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA';
const SP_TAB = 'sp';

function getAuthClient() {
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!rawKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
  }
  let credentials: Record<string, string>;
  try {
    credentials = JSON.parse(rawKey) as Record<string, string>;
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON');
  }
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

function pick(parsed: Record<string, string>, ...keys: string[]): string {
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

function parseFloatVal(val: string): number {
  if (!val || !val.trim()) return 0;
  const num = parseFloat(val.replace(/[^\d.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

function cleanString(val: string): string | null {
  const t = val.trim();
  return t === '' ? null : t;
}

function cleanBool(val: string, fallback: boolean): boolean {
  if (!val || val.trim() === '') return fallback;
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

function rowToProduct(
  headers: string[],
  row: (string | null | undefined)[]
): Product | null {
  const parsed: Record<string, string> = {};
  headers.forEach((h, i) => {
    parsed[h.trim()] = String(row[i] ?? '').trim();
  });

  const id = cleanString(pick(parsed, 'id', 'ID', 'product_id'));
  const slug = cleanString(pick(parsed, 'slug', 'Slug'));
  const name = cleanString(pick(parsed, 'name', 'Name', 't\u00ean', 'ten_san_pham'));

  if (!id || !slug || !name) return null;

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

  return {
    id,
    slug,
    name,
    categorySlug: cleanString(
      pick(parsed, 'category_slug', 'categorySlug', 'category', 'danh_muc', 'danh m\u1ee5c')
    ) ?? '',
    shortDescription: cleanString(
      pick(parsed, 'short_description', 'shortDescription', 'mo_ta_ngan', 'm\u00f4 t\u1ea3 ng\u1eafn')
    ) ?? '',
    description: cleanString(
      pick(parsed, 'description', 'mo_ta', 'm\u00f4 t\u1ea3')
    ) ?? '',
    origin: cleanString(
      pick(parsed, 'origin', 'xuat_xu', 'xu\u1ea5t x\u1ee9')
    ) ?? '',
    weight: cleanString(
      pick(parsed, 'weight', 'trong_luong', 'tr\u1ecdng l\u01b0\u1ee3ng', 'kl')
    ) ?? '',
    price: parseNumber(pick(parsed, 'price', 'gia', 'gi\u00e1')),
    oldPrice: (function () {
      const v = pick(parsed, 'old_price', 'oldPrice', 'gia_cu', 'gi\u00e1 c\u0169', 'compare_price');
      if (!v) return undefined;
      const n = parseNumber(v);
      return n > 0 ? n : undefined;
    })(),
    unit: cleanString(pick(parsed, 'unit', 'don_vi', '\u0111\u01a1n v\u1ecb')) ?? '',
    image: cleanString(pick(parsed, 'image', 'anh', '\u1ea3nh', 'hinh', 'thumbnail')) ?? '',
    gallery: parseTags(pick(parsed, 'gallery', 'album', 'images', 'anh_phu')),
    features: parseTags(pick(parsed, 'features', 'dac_diem', '\u0111\u1eb7c \u0111i\u1ec3m', 'tinh_nang')),
    nutritionFacts: parseNutritionFacts(
      pick(parsed, 'nutrition_facts', 'nutritionFacts', 'dinh_duong')
    ),
    tags: parseTags(pick(parsed, 'tags', 'tag', 'tu_khoa')),
    shopeeUrl: cleanString(pick(parsed, 'shopee_url', 'shopeeUrl', 'shopee')) ?? undefined,
    rating: parseFloatVal(pick(parsed, 'rating', 'danh_gia', '\u0111\u00e1nh gi\u00e1')),
    reviewCount: parseNumber(pick(parsed, 'review_count', 'reviewCount', 'so_danh_gia')),
    soldCount: parseNumber(pick(parsed, 'sold_count', 'soldCount', 'da_ban', 'sold')),
    inStock: cleanBool(inStockRaw, true),
    isFeatured: cleanBool(
      pick(parsed, 'is_featured', 'isFeatured', 'featured', 'noi_bat'),
      false
    ),
    isBestSeller: cleanBool(
      pick(parsed, 'is_best_seller', 'isBestSeller', 'best_seller', 'ban_chay'),
      false
    ),
    isNew: cleanBool(
      pick(parsed, 'is_new', 'isNew', 'new', 'moi', 'm\u1edbi'),
      false
    ),
    createdAt: cleanString(pick(parsed, 'created_at', 'createdAt', 'ngay_tao')) ?? new Date().toISOString(),
  };
}

export async function fetchProductsFromSheet(): Promise<Product[]> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SP_TAB,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = (rows[0] as string[]).map((h) => String(h ?? '').trim());
  console.log('[google-sheet] Headers found:', headers);

  const dataRows = rows.slice(1) as (string | null | undefined)[][];
  const products: Product[] = [];

  for (const row of dataRows) {
    if (!row || row.every((cell) => !cell)) continue;
    const product = rowToProduct(headers, row);
    if (product) {
      products.push(product);
    } else {
      console.warn('[google-sheet] Skipped row (missing id/slug/name):', row.slice(0, 5));
    }
  }

  console.log(`[google-sheet] Parsed ${products.length} products from ${dataRows.length} rows`);
  return products;
}
