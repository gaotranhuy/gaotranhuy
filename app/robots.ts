import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/gio-hang',
          '/dat-hang',
          '/api/',
          '/*?*',
        ],
      },
    ],
    sitemap: 'https://gaotranhuy.vn/sitemap.xml',
  };
}
