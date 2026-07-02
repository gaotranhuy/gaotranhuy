import type { MetadataRoute } from 'next';

const SITE_URL = 'https://gaotranhuy.vn';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/gio-hang', '/dat-hang', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
