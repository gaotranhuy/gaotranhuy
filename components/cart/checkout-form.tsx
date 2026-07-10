'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  ArrowLeft,
  Check,
  User,
  Phone,
  MapPin,
  MessageCircle,
  Truck,
  Store,
  ShoppingCart,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { siteSettings } from '@/data/site';

type ShippingRegion = 'da-nang' | 'nationwide';

// DANH SÁCH CÁC PHƯỜNG MỚI SAU KHI SÁP NHẬP TẠI ĐÀ NẴNG
const DANANG_WARDS = [
  'Phường Hải Châu (Quận Hải Châu - Mới)',
  'Phường Hòa Cường (Quận Hải Châu - Mới)',
  'Phường Thanh Khê (Quận Thanh Khê - Mới)',
  'Phường An Khê (Quận Thanh Khê - Mới)',
  'Phường An Hải (Quận Sơn Trà - Mới)',
  'Phường Sơn Trà (Quận Sơn Trà - Mới)',
  'Phường Cẩm Lệ (Quận Cẩm Lệ - Mới)',
  'Phường Mỹ An (Quận Ngũ Hành Sơn)',
  'Phường Khuê Mỹ (Quận Ngũ Hành Sơn)',
  'Phường Hòa Quý (Quận Ngũ Hành Sơn)',
  'Phường Hòa Hải (Quận Ngũ Hành Sơn)',
  'Phường Hòa Minh (Quận Liên Chiểu)',
  'Phường Hòa Khánh Bắc (Quận Liên Chiểu)',
  'Phường Hòa Khánh Nam (Quận Liên Chiểu)',
  'Phường Hòa Hiệp Bắc (Quận Liên Chiểu)',
  'Phường Hòa Hiệp Nam (Quận Liên Chiểu)',
];

export function CheckoutForm() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [region, setRegion] = React.useState<ShippingRegion>('da-nang');
  
  const [form, setForm] = React.useState({
    name: '',
    phone: '',
    ward: '',
    streetAddress: '', 
    note: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const freeShipThreshold = 500000; 
  const isFreeShipping = totalPrice >= freeShipThreshold;
  const shippingFee = isFreeShipping ? 0 : siteSettings.shippingFee;
  const grandTotal = totalPrice + shippingFee;
  
  const amountNeededForFreeShip = freeShipThreshold - totalPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.ward || !form.streetAddress) return;

    setSubmitting(true);

    const productLines = items
      .map((item) => {
        const i = item as any;
        const name = i.name || i.product?.name || 'Sản phẩm Gạo';
        const price = Number(i.price || i.product?.price || 0);
        const quantity = Number(i.quantity || 1);
        return `   - ${name} x${quantity}: ${formatPrice(price * quantity)}`;
      })
      .join('\n');

    const fullAddress = `${form.streetAddress}, ${form.ward}, TP. Đà Nẵng`;

    const orderText =
      `🛒 ĐƠN HÀNG GẠO TRẦN HUY (ĐÀ NẴNG)\n\n` +
      `👤 Khách: ${form.name}\n` +
      `📞 SĐT: ${form.phone}\n` +
      `📍 Địa chỉ: ${fullAddress}\n` +
      (form.note ? `📝 Ghi chú: ${form.note}\n` : '') +
      `\n📦 Sản phẩm:\n` +
      productLines +
      `\n\n💰 Tạm tính: ${formatPrice(totalPrice)}\n` +
      `🚚 Phí ship: ${shippingFee === 0 ? 'Miễn phí (Đạt mốc >500k)' : formatPrice(shippingFee)}\n` +
      `✅ Tổng cộng: ${formatPrice(grandTotal)}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(orderText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = orderText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Lỗi khay nhớ tạm:", err);
    }

    const oaId = "3621179647129049909";
    const zaloOaUrl = `https://zalo.me/${oaId}?text=${encodeURIComponent(orderText)}`;

    window.location.href = zaloOaUrl;
    
    setTimeout(() => {
      clearCart();
      setSubmitted(true);
      setSubmitting(false);
    }, 400);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border bg-card py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-10 w-10" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">
            Đặt hàng thành công!
          </h2>
          <p className="mt-3 text-sm text-muted-foreground px-6 leading-relaxed">
            Hệ thống đang mở ứng dụng Zalo để chuyển đơn hàng của bạn. <br />
            <span className="text-primary font-semibold block mt-2">💡 MẸO GỬI ĐƠN NHANH:</span> 
            Nếu ô chat Zalo bị trống chữ, bạn chỉ cần <strong>Nhấn giữ vào ô nhập tin nhắn</strong> chọn <strong>Dán (Paste)</strong> để gửi ngay hóa đơn đã sao chép tự động nhé!
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button asChild>
            <Link href="/san-pham">Tiếp tục mua sắm</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Giỏ hàng trống</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hãy thêm sản phẩm trước khi đặt hàng.
          </p>
        </div>
        <Button asChild>
          <Link href="/san-pham">
            Khám phá sản phẩm
            <ArrowLeft className="mr-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight">
        Đặt hàng
      </h1>

      {/* Thanh trạng thái thông báo Free Ship trực quan */}
      <div className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-sm transition-all ${
        isFreeShipping 
          ? 'bg-success/5 border-success/30 text-success' 
          : 'bg-warning/5 border-warning/30 text-warning-foreground'
      }`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isFreeShipping ? 'bg-success text-success-foreground' : 'bg-warning/20 text-warning'
        }`}>
          <Gift className="h-5 w-5" />
        </div>
        <div className="flex-1">
          {isFreeShipping ? (
            <div>
              <div className="font-bold text-base">🎉 Đơn hàng được FREE SHIP!</div>
              <p className="text-xs text-muted-foreground mt-0.5">Hóa đơn của bạn đã đạt mốc trên {formatPrice(freeShipThreshold)}, Gạo Trần Huy miễn phí giao hàng nội thành.</p>
            </div>
          ) : (
            <div>
              <div className="font-bold text-base text-amber-700">Mua thêm {formatPrice(amountNeededForFreeShip)} để được FREE SHIP</div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${Math.min((totalPrice / freeShipThreshold) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Đơn hàng hiện tại: {formatPrice(totalPrice)} / Mốc miễn phí ship: {formatPrice(freeShipThreshold)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">Khu vực giao hàng</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRegion('da-nang')}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  region === 'da-nang'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'hover:border-primary/50'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    region === 'da-nang'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Nội thành Đà Nẵng</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Giao tận nơi, đặt qua Zalo OA
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRegion('nationwide')}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  region === 'nationwide'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'hover:border-primary/50'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    region === 'nationwide'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Ship toàn quốc</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Đặt hàng qua Shopee, an toàn & bảo mật
                  </div>
                </div>
              </button>
            </div>
          </div>

          {region === 'da-nang' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border bg-card p-5">
                <h2 className="mb-4 text-base font-semibold">Thông tin giao hàng</h2>
                <div className="grid gap-4">
                  
                  {/* Họ và tên */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Họ và tên <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Số điện thoại <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="0901 234 567"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Chọn Phường mới từ danh sách sáp nhập hành chính */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Chọn Phường mới <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                      <select
                        required
                        value={form.ward}
                        onChange={(e) => setForm({ ...form, ward: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                      >
                        <option value="">-- Bấm để chọn Phường (Hành chính mới) --</option>
                        {DANANG_WARDS.map((ward, idx) => (
                          <option key={idx} value={ward}>
                            {ward}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Địa chỉ Số nhà / Tên đường ngắn gọn */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Số nhà, Tên đường <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        required
                        value={form.streetAddress}
                        onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                        placeholder="Ví dụ: 123 Nguyễn Chí Thanh"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Ghi chú */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
                    <button type="button" className="hidden" /> 
                    <Textarea
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Thời gian giao hàng, lưu ý khi gọi điện..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-4 text-sm">
                <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-muted-foreground">
                  Hệ thống tích hợp luồng xử lý kép: Form đơn hàng được nạp tự động vào link đồng thời sao chép sẵn vào máy để đảm bảo đơn đi thành công.
                </p>
              </div>

              <Button type="submit" size="lg" disabled={submitting} className="w-full gap-2">
                {submitting ? 'Đang mở ứng dụng Zalo...' : 'Xác nhận đơn hàng & Gửi qua Zalo'}
              </Button>
            </form>
          )}

          {region === 'nationwide' && (
            <div className="space-y-6">
              <div className="rounded-2xl border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-lg font-bold">Đặt hàng qua Shopee</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Để đặt hàng giao toàn quốc, vui lòng hoàn tất thanh toán trên gian hàng Shopee của chúng tôi.
                </p>
                <Button asChild size="lg" className="mt-5 w-full gap-2 sm:w-auto">
                  <a href="https://shopee.vn/gaotranhuy" target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="h-5 w-5" />
                    Mua hàng trên Shopee
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tóm tắt đơn hàng */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">Đơn hàng ({totalItems})</h2>
            <ul className="max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => {
                const i = item as any;
                const id = i.id || i.product?.id;
                const name = i.product?.name || i.name;
                const image = i.product?.image || i.image;
                const unit = i.product?.unit || i.unit;
                const price = i.product?.price || i.price || 0;
                
                return (
                  <li key={id} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {image && (
                        <Image src={image} alt={name || 'Product'} fill sizes="56px" className="object-cover" />
                      )}
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="line-clamp-1 text-sm font-medium">{name}</span>
                      <span className="text-xs text-muted-foreground">{unit}</span>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí giao hàng</span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-success font-bold">Miễn phí</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
