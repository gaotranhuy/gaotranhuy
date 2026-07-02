# Gạo Trần Huy - Website bán gạo

Website bán gạo và đặc sản Việt Nam cho cửa hàng **Gạo Trần Huy** (gaotranhuy.vn). Xây dựng bằng Next.js 13 (App Router), TypeScript, Tailwind CSS và Lucide React.

## Tính năng

- **Trang chủ**: Hero, danh mục, sản phẩm nổi bật (tabs), features, CTA, tin tức
- **Sản phẩm**: Danh sách với tìm kiếm, lọc theo danh mục, sắp xếp
- **Chi tiết sản phẩm**: Gallery, tabs mô tả/đặc điểm/dinh dưỡng, đặt qua Zalo, sản phẩm liên quan
- **Danh mục**: 6 danh mục (Gạo Bình Dân, Đặc Sản, Nếp & Lứt, Phổ Thông, Nước Mắm & Dầu Lạc, Sản Phẩm Khác)
- **Giỏ hàng**: Drawer + trang đầy đủ, lưu localStorage, thanh tiến trình miễn phí ship
- **Đặt hàng**: Form giao hàng, 3 phương thức thanh toán (COD/Chuyển khoản/Zalo)
- **Tin tức**: 6 bài viết SEO với Article JSON-LD
- **Giới thiệu, Liên hệ** (form + bản đồ), trang 404 tùy chỉnh

## SEO

- `sitemap.ts`, `robots.ts`, `manifest.ts`
- Metadata đầy đủ (Open Graph, Twitter, canonical)
- JSON-LD: Product, Breadcrumb, Article, Organization
- URL đẹp: `/san-pham/gao-st25`, `/danh-muc/gao-dac-san`
- ISR (revalidate 3600s) cho trang chi tiết
- Ảnh WebP/AVIF, lazy loading

## Công nghệ

- Next.js 13.5 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Lucide React (icons)
- Font: Be Vietnam Pro + Inter (hỗ trợ tiếng Việt)

## Cấu trúc thư mục

```
app/                  # App Router pages
  page.tsx            # Trang chủ
  san-pham/           # Sản phẩm + [slug]
  danh-muc/[slug]     # Danh mục
  gio-hang/           # Giỏ hàng
  dat-hang/           # Đặt hàng
  tin-tuc/            # Tin tức + [slug]
  gioi-thieu/         # Giới thiệu
  lien-he/            # Liên hệ
  sitemap.ts          # Sitemap
  robots.ts           # Robots
  manifest.ts         # PWA manifest
components/
  layout/             # Header, Footer, BackToTop
  home/               # Hero, CategorySection, FeaturedProducts...
  product/            # ProductCard, ProductDetail, ProductGrid...
  cart/               # CartDrawer, CartView, CheckoutForm
  news/               # NewsCard, RelatedNews
  common/             # Breadcrumb, PageHeader, ContactForm...
  ui/                 # shadcn/ui components
lib/                  # cart-context, seo, products, news, format
data/                 # products.ts, categories.ts, news.ts, site.ts
types/                # TypeScript types
hooks/                # use-toast
```

## Cách cập nhật sản phẩm/giá

Sửa file `data/products.ts` - thêm/sửa/xóa sản phẩm. Không cần sửa code khác, build sẽ tự cập nhật.

## Chạy locally

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

## Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → import repo
3. Framework Preset: Next.js (tự nhận)
4. Bấm Deploy

## Thông tin liên hệ (cấu hình trong `data/site.ts`)

- Hotline: 0901 234 567
- Zalo: 0901234567
- Email: lienhe@gaotranhuy.vn
- Địa chỉ: 123 Đường Nông Sản, Bình Tân, TP. HCM

---

© Gạo Trần Huy. Tất cả quyền được bảo lưu.
