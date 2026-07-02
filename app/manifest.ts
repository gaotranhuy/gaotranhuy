import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gạo Trần Huy',
    short_name: 'Gạo Trần Huy',
    description:
      'Gạo thơm dẻo, nước mắm nhĩ Nam Ô, dầu lạc nguyên chất - đặc sản Việt.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f2',
    theme_color: '#d68a2e',
    lang: 'vi',
    categories: ['food', 'shopping'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
