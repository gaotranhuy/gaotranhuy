# Gạo Trần Huy - Website bán gạo

Website bán gạo và đặc sản Việt Nam cho cửa hàng **Gạo Trần Huy** (gaotranhuy.vn). Xây dựng bằng Next.js 15 (App Router), TypeScript, Tailwind CSS và Lucide React.

## Tính năng
- **Trang chủ**: Hero, danh mục, sản phẩm nổi bật (tabs), features, CTA, tin tức
- **Sản phẩm**: Danh sách với tìm kiếm, lọc theo danh mục, sắp xếp
- **Chi tiết sản phẩm**: Gallery, tabs mô tả/đặc điểm/dinh dưỡng, đặt qua Zalo, sản phẩm liên quan
- **Danh mục**: 6 danh mục (Gạo Bình Dân, Đặc Sản, Nếp & Lứt, Phổ Thông, Nước Mắm & Dầu Lạc, Sản Phẩm Khác)
- **Giỏ hàng**: Drawer + trang đầy đủ, lưu localStorage, thanh tiến trình miễn phí ship
- **Đặt hàng**: Form giao hàng, 3 phương thức thanh toán (COD/Chuyển khoản/Zalo)
- **Tin tức**: 6 bài viết SEO với Article JSON-LD
- **Giới thiệu, Liên hệ** (form + bản đồ), trang 404 tùy chỉnh
- **CMS Admin**: Quản lý sản phẩm và blog, đồng bộ Google Sheet, upload ảnh Cloudinary

## Hệ thống CMS Admin

### 1. Truy cập Admin

- URL: `/admin/login`
- Mật khẩu mặc định: `admin123` (cấu hình trong `.env.local` qua biến `ADMIN_PASSWORD`)

### 2. Quản lý sản phẩm (`/admin/products`)

- Bảng danh sách với tìm kiếm, lọc theo danh mục, phân trang (10 dòng/trang)
- Thêm/Sửa/Xóa sản phẩm với Optimistic UI
- Upload ảnh lên Cloudinary (tự động tối ưu WebP)
- ID tự động sinh tăng dần (p001, p002, ...)
- Đồng bộ dữ liệu từ Google Sheet

### 3. Quản lý Blog (`/admin/blog`)

- Bảng danh sách bài viết với phân trang
- Thêm/Sửa/Xóa với Optimistic UI
- Trình soạn thảo Rich Text (Tiptap) - in đậm, in nghiêng, tiêu đề, danh sách, trích dẫn
- Upload ảnh bìa lên Cloudinary

### 4. Tích hợp Cloudinary

- Cloud Name: `f9krxetg`
- Upload Preset (Unsigned): `gaotranhuy`
- Ảnh tự động chuyển sang WebP, tối ưu kích thước (800x800, quality auto:best)
- Placeholder mặc định nếu ảnh lỗi

### 5. Đồng bộ Google Sheet

#### Cấu hình Google Sheet

Google Sheet mẫu: [Link Sheet](https://docs.google.com/spreadsheets/d/10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA/edit)

Sheet gồm 2 tab:
- **Tab "sp"**: id, name, slug, category, categorySlug, price, oldPrice, unit, origin, shortDescription, description, image, rating, sold, inStock, isFeatured, isBestSeller, tags
- **Tab "blog"**: id, title, slug, excerpt, content, image, category, author, date, readTime

#### Đồng bộ từ Sheet vào CMS

Trong trang Admin > Sản phẩm, bấm nút "Đồng bộ Google Sheet" để kéo dữ liệu từ Sheet vào database.

#### Đồng bộ ngược từ CMS lên Sheet (Google Apps Script)

Để khi thao tác trên CMS, dữ liệu tự động ghi ngược lên Google Sheet:

1. Mở Google Sheet > Extensions > Apps Script
2. Dán nội dung file `google-apps-script/Code.gs` vào
3. (Tùy chọn) Chạy hàm `setWebhookSecret()` để đặt mật khẩu webhook
4. Deploy > New deployment:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy URL deployment (dạng `https://script.google.com/macros/s/XXXXX/exec`)
6. Thêm vào `.env.local`:
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
   ```

Khi CMS thêm/sửa/xóa sản phẩm hoặc blog, webhook sẽ tự động gọi Google Apps Script để cập nhật Sheet.

## SEO

- `sitemap.ts`, `robots.ts`, `manifest.ts`
- Metadata đầy đủ (Open Graph, Twitter, canonical)
- JSON-LD: Product, Breadcrumb, Article, Organization
- URL đẹp: `/san-pham/gao-st25`, `/danh-muc/gao-dac-san`
- ISR (revalidate 3600s) cho trang chi tiết
- Ảnh WebP/AVIF, lazy loading

## Công nghệ

- Next.js 15.5 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- Lucide React (icons)
- Tiptap (Rich Text Editor)
- Supabase (Database)
- Cloudinary (Image upload)
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
  admin/              # CMS Admin (login, products, blog)
  api/                # API Routes (admin, upload, sync)
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
  admin/              # ProductsManager, BlogManager, ImageUpload, RichTextEditor
  ui/                 # shadcn/ui components
lib/                  # cart-context, seo, products, news, format, supabase, cloudinary, admin-auth
data/                 # products.ts, categories.ts, news.ts, site.ts
types/                # TypeScript types
hooks/                # use-toast
google-apps-script/   # Code.gs - Google Apps Script webhook
```

## Biến môi trường (.env.local)

```
# Supabase (đã cấu hình sẵn)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Admin password (đổi mật khẩu mặc định)
ADMIN_PASSWORD=admin123

# Google Apps Script Webhook URL (tùy chọn - để đồng bộ ngược lên Sheet)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
```

## Chạy locally

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Build

```bash
npm run build
```

## Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → import repo
3. Framework Preset: Next.js (tự nhận)
4. Thêm environment variables (ADMIN_PASSWORD, GOOGLE_SCRIPT_URL)
5. Bấm Deploy

## Thông tin liên hệ (cấu hình trong `data/site.ts`)

- Hotline: 0901 234 567
- Zalo: 0901234567
- Email: lienhe@gaotranhuy.vn
- Địa chỉ: 123 Đường Nông Sản, Bình Tân, TP. HCM

---

© Gạo Trần Huy. Tất cả quyền được bảo lưu.
