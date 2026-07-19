import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Be_Vietnam_Pro } from 'next/font/google';
import dynamic from 'next/dynamic';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

const Toaster = dynamic(
  () => import('@/components/ui/sonner').then((m) => m.Toaster),
  { ssr: false }
);

const CartClient = dynamic(
  () => import('@/components/cart/cart-client').then((m) => m.CartClient),
  { ssr: false }
);

const BackToTop = dynamic(
  () => import('@/components/layout/back-to-top').then((m) => m.BackToTop),
  { ssr: false }
);

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const SITE_URL = 'https://gaotranhuy.vn';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Gạo Trần Huy | Gạo Thơm Dẻo, Nước Mắm Nam Ô, Đặc sản Việt',
    template: '%s | Gạo Trần Huy',
  },
  description:
    'Gạo Trần Huy chuyên cung cấp gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm nhĩ Nam Ô và dầu lạc nguyên chất. Giao hàng tận nơi, giá hợp lý.',
  keywords: [
    'gạo trần huy',
    'gạo bình dân',
    'gạo đặc sản',
    'gạo nếp',
    'gạo lứt',
    'gạo st25',
    'nước mắm nam ô',
    'dầu lạc nguyên chất',
    'gạo thơm dẻo',
    'bán gạo',
  ],
  authors: [{ name: 'Gạo Trần Huy' }],
  creator: 'Gạo Trần Huy',
  publisher: 'Gạo Trần Huy',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: 'Gạo Trần Huy',
    title: 'Gạo Trần Huy | Gạo Thơm Dẻo, Nước Mắm Nam Ô, Đặc sản Việt',
    description:
      'Gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm nhĩ Nam Ô và dầu lạc nguyên chất. Giao hàng tận nơi.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gạo Trần Huy - Gạo thơm dẻo, đặc sản Việt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gạo Trần Huy | Gạo Thơm Dẻo, Đặc sản Việt',
    description:
      'Gạo bình dân, gạo đặc sản, gạo nếp, gạo lứt, nước mắm nhĩ Nam Ô và dầu lạc nguyên chất.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'food',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#d68a2e' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1410' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>

      <body
        className={`${inter.variable} ${beVietnam.variable} font-sans`}
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>

        <CartClient />
        <BackToTop />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
