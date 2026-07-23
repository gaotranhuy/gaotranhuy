import type { MetadataRoute } from 'next';
import { fetchAllProducts, fetchAllNews } from '@/lib/supabase-data';
import { getAllCategories } from '@/lib/products';

const SITE_URL = 'https://gaotranhuy.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Khai báo danh sách các trang tĩnh
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/san-pham`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/gioi-thieu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/lien-he`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tin-tuc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/gio-hang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/dat-hang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 2. Lấy dữ liệu danh mục đồng bộ (giữ nguyên không dùng await như thiết kế của bạn)
  const categories = getAllCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/danh-muc/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. TỐI ƯU: Gọi song song cả Products và News cùng lúc bằng Promise.all để giảm thời gian phản hồi
  const [products, news] = await Promise.all([
    fetchAllProducts(),
    fetchAllNews(),
  ]);

  // 4. Map dữ liệu sản phẩm
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/san-pham/${p.slug}`,
    lastModified: p.createdAt ? new Date(p.createdAt) : new Date(), // Phòng tránh lỗi Invalid Date nếu DB mất dữ liệu
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 5. Map dữ liệu tin tức
  const newsPages: MetadataRoute.Sitemap = news.map((a) => ({
    url: `${SITE_URL}/tin-tuc/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(), // Phòng tránh lỗi Invalid Date nếu DB mất dữ liệu
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...newsPages];
}
