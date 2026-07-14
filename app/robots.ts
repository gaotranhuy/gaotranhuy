import type { MetadataRoute } from 'next';

const SITE_URL = 'https://gaotranhuy.vn';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/_next/static/images/', // Cho phép bot đọc ảnh tối ưu của Next.js để SEO hình ảnh tốt hơn
      ],
      disallow: [
        '/gio-hang',      // Chặn trang giỏ hàng (không có giá trị SEO)
        '/dat-hang',      // Chặn trang đặt hàng / thanh toán
        '/api/',          // Chặn các route API kết nối backend/Supabase
        '/*_next/*',      // Chặn bot quét các file build nội bộ của Next.js
        '/*?*',           // Chặn các URL chứa tham số query parameters (tránh trùng lặp nội dung do bộ lọc/tìm kiếm)
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
