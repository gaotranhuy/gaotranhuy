import { google } from 'googleapis';
import type { Product } from '@/types';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA';
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

function parseTags(val: string | undefined | null): string[] {
  if (!val || !val.trim()) return [];
  return val
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseNumber(val: string | undefined | null): number {
  if (!val || !val.trim()) return 0;
  const num = parseFloat(val.replace(/[^\d.-]/g, ''));
  return isNaN(num) ? 0 : Math.round(num);
}

function parseBoolean(val: string | undefined | null): boolean {
  if (!val) return false;
  return ['true', '1', 'yes', 'co', 'có'].includes(val.trim().toLowerCase());
}

function cleanString(val: string | undefined | null): string | null {
  if (val == null) return null;
  const trimmed = val.trim();
  return trimmed === '' ? null : trimmed;
}

function parseJsonArray(
  val: string | undefined | null
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
  const get = (key: string): string => {
    const idx = headers.indexOf(key);
    if (idx === -1) return '';
    return (row[idx] ?? '').trim();
  };

  const id = get('id');
  const slug = get('slug');
  if (!id || !slug) return null;

  return {
    id,
    slug,
    name: get('name'),
    categorySlug: get('category_slug'),
    shortDescription: get('short_description'),
    description: get('description'),
    origin: get('origin'),
    weight: get('weight'),
    price: parseNumber(get('price')),
    oldPrice: parseNumber(get('old_price')) || undefined,
    unit: get('unit'),
    image: get('image'),
    gallery: parseTags(get('gallery')),
    features: parseTags(get('features')),
    nutritionFacts: parseJsonArray(get('nutrition_facts')),
    tags: parseTags(get('tags')),
    shopeeUrl: cleanString(get('shopee_url')) ?? undefined,
    rating: parseNumber(get('rating')),
    reviewCount: parseNumber(get('review_count')),
    soldCount: parseNumber(get('sold_count')),
    inStock: parseBoolean(get('in_stock')),
    isFeatured: parseBoolean(get('is_featured')),
    isBestSeller: parseBoolean(get('is_best_seller')),
    isNew: parseBoolean(get('is_new')),
    createdAt: get('created_at') || new Date().toISOString(),
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

  const headers = (rows[0] as string[]).map((h) => h.trim());
  const dataRows = rows.slice(1) as (string | null | undefined)[][];

  const products: Product[] = [];
  for (const row of dataRows) {
    if (!row || row.every((cell) => !cell)) continue;
    const product = rowToProduct(headers, row);
    if (product) products.push(product);
  }

  return products;
}
