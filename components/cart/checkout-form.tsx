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
  Send,
  Truck,
  Store,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { siteSettings, contactInfo } from '@/data/site';

type ShippingRegion = 'da-nang' | 'nationwide';

export function CheckoutForm() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [region, setRegion] = React.useState<ShippingRegion>('da-nang');
  const [form, setForm] = React.useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const shippingFee =
    totalPrice >= siteSettings.freeShippingThreshold
      ? 0
      : siteSettings.shippingFee;
  const grandTotal = totalPrice + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;

    setSubmitting(true);

    // Chuẩn hóa dữ liệu sản phẩm an toàn
    const productLines = items
      .map((item) => {
        const i = item as any;
        const name = i.product?.name || i.name || 'Sản phẩm';
        const price = Number(i.product?.price || i.price || 0);
        const quantity = Number(i.quantity || 1);
        return `   - ${name} x${quantity}: ${formatPrice(price * quantity)}`;
      })
      .join('\n');

    // Tạo chuỗi văn bản đơn hàng chi tiết
    const orderText =
      `🛒 ĐƠN HÀNG GẠO TRẦN HUY\n\n` +
      `👤 Khách: ${form.name}\n` +
      `📞 SĐT: ${form.phone}\n` +
      `📍 Địa chỉ: ${form.address}\n` +
      (form.note ? `📝 Ghi chú: ${form.note}\n` : '') +
      `\n📦 Sản phẩm:\n` +
      productLines +
      `\n\n💰 Tạm tính: ${formatPrice(totalPrice)}\n` +
      `🚚 Phí ship: ${shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}\n` +
      `✅ Tổng cộng: ${formatPrice(grandTotal)}`;

    // 🔥 GIẢI PHÁP ĐẶC TRỊ ZALO: TỰ ĐỘNG SAO CHÉP ĐƠN HÀNG VÀO BỘ NHỚ TẠM CỦA KHÁCH
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
      alert("📋 Thông tin đơn hàng đã được tự động SAO CHÉP!\n\nSau khi Zalo mở lên, bạn chỉ cần bấm đè vào ô chat và chọn 'DÁN' (Paste) để gửi cho shop xác nhận nhé.");
    } catch (err) {
      console.log("Không thể sao chép tự động");
    }

    // Định dạng số điện thoại và mở Zalo thẳng ô chat của bạn
    const zaloPhone = contactInfo.zalo.replace(/^0/, '84');
    const zaloUrl = `https://zalo.me/${zaloPhone}`;

    try {
      const link = document.createElement('a');
      link.href = zaloUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.location.href = zaloUrl;
    }

    setSubmitting(false);
    setSubmitted(true);
    clearCart();
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
          <p className="mt-2 text-sm text-muted-foreground">
            Cảm ơn bạn đã đặt hàng. Hệ thống đã tự sao chép đơn, vui lòng nhấn **Dán** vào khung chat Zalo để gửi cho chúng tôi.
          </p>
        </div>
        <div className="flex gap-2">
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

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Khu vực giao hàng */}
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
                  <div className="text-sm font-semibold">
                    Nội thành Đà Nẵng
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Giao tận nơi, đặt hàng qua Zalo
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

          {/* Form giao hàng Đà Nẵng */}
          {region === 'da-nang' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border bg-card p-5">
                <h2 className="mb-4 text-base font-semibold">
                  Thông tin giao hàng
                </h2>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Họ và tên <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Nguyễn Văn A"
                        className="pl-10"
                      />
                    </div>
                  </div>
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
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="0901 234 567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Địa chỉ giao hàng{' '}
                      <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        required
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder="Số nhà, đường, phường, quận, TP. Đà Nẵng"
                        className="pl-10"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Ghi chú (tùy chọn)
                    </label>
                    <Textarea
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      placeholder="Thời gian giao hàng, lưu ý đặc biệt..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-4 text-sm">
                <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-muted-foreground">
                  Đơn hàng sẽ được tự động sao chép. Bạn chỉ cần <strong>Dán</strong> vào ô chat Zalo sau khi hệ thống chuyển hướng.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full gap-2"
              >
                {submitting ? 'Đang chuyển...' : 'Xác nhận đơn & Mở Zalo'}
              </Button>
            </form>
          )}

          {/* Luồng Toàn quốc */}
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
                  <a href={contactInfo.shopee} target="_blank" rel="noopener noreferrer">
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
            <h2 className="mb-4 text-base font-semibold">
              Đơn hàng ({totalItems})
            </h2>
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
                        <Image
                          src={image}
                          alt={name || 'Product'}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="line-clamp-1 text-sm font-medium">
                        {name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {unit}
                      </span>
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
                    <span className="text-success">Miễn phí</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
