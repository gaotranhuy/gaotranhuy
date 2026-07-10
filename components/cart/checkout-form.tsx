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
  ArrowRight,
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
  const [zaloRedirectUrl, setZaloRedirectUrl] = React.useState('');

  const shippingFee =
    totalPrice >= siteSettings.freeShippingThreshold
      ? 0
      : siteSettings.shippingFee;
  const grandTotal = totalPrice + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;

    setSubmitting(true);

    // 1. Kiểm tra thuộc tính phẳng hoặc lồng của giỏ hàng
    const productLines = items
      .map((item) => {
        const i = item as any;
        const name = i.name || i.product?.name || 'Sản phẩm Gạo';
        const price = Number(i.price || i.product?.price || 0);
        const quantity = Number(i.quantity || 1);
        return `   - ${name} x${quantity}: ${formatPrice(price * quantity)}`;
      })
      .join('\n');

    // 2. Tạo chuỗi văn bản đơn hàng
    const orderText =
      `🛒 ĐƠN HÀNG GẠO TRẦN HUY (ĐÀ NẴNG)\n\n` +
      `👤 Khách: ${form.name}\n` +
      `📞 SĐT: ${form.phone}\n` +
      `📍 Địa chỉ: ${form.address}\n` +
      (form.note ? `📝 Ghi chú: ${form.note}\n` : '') +
      `\n📦 Sản phẩm:\n` +
      productLines +
      `\n\n💰 Tạm tính: ${formatPrice(totalPrice)}\n` +
      `🚚 Phí ship: ${shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}\n` +
      `✅ Tổng cộng: ${formatPrice(grandTotal)}`;

    // 3. Hệ thống sao chép ngầm vào khay nhớ tạm để dự phòng tốt nhất
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
      console.error("Lỗi sao chép khay nhớ tạm:", err);
    }

    // 4. Thiết lập ID Zalo OA và gán vào trạng thái để kích hoạt luồng mồi
    const oaId = "3621179647129049909";
    const zaloOaUrl = `https://zalo.me/${oaId}?text=${encodeURIComponent(orderText)}`;
    setZaloRedirectUrl(zaloOaUrl);

    // 5. Chuyển đổi trạng thái màn hình để hiện nút bấm lớn hướng dẫn khách
    clearCart();
    setSubmitted(true);
    setSubmitting(false);
  };

  // MÀN HÌNH ĐÓN KHÁCH TRỰC QUAN: Giúp khách lớn tuổi dễ dàng gửi đơn mà không cần biết Dán
  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border bg-card p-6 py-10 text-center shadow-xl border-gray-100">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success animate-pulse">
          <Check className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-black text-gray-900">
            ĐÃ GHI NHẬN ĐƠN HÀNG!
          </h2>
          <p className="text-sm text-muted-foreground px-4 leading-relaxed">
            Hóa đơn gạo của bạn đã sẵn sàng. Hãy bấm vào nút xanh lớn phía dưới để mở Zalo và gửi đơn cho cửa hàng nhé!
          </p>
        </div>

        {/* NÚT BẤM HÀNH ĐỘNG MỒI: Giúp nạp chữ trực tiếp vào ô chat Zalo OA */}
        <div className="w-full px-2">
          <a
            href={zaloRedirectUrl}
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#0068ff] hover:bg-[#0056d2] text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-100 transition-all transform active:scale-95"
          >
            <MessageCircle className="h-5 w-5 fill-white" />
            BẤM VÀO ĐÂY ĐỂ GỬI ĐƠN QUA ZALO
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/60 p-4 text-left text-xs text-amber-800 mx-2">
          <p className="font-bold mb-1">💡 Mẹo nhỏ cho cô chú, anh chị:</p>
          <p>
            Sau khi bấm nút xanh, ứng dụng Zalo sẽ hiện ra. Nếu chữ đã được điền sẵn, bạn <strong>chỉ việc bấm nút Gửi</strong>. Nếu ô chat trống, bạn chỉ cần <strong>Nhấn giữ vào ô nhập chữ ➔ chọn Dán (Paste)</strong> là được nhé!
          </p>
        </div>

        <div className="flex gap-2 w-full px-2 mt-2">
          <Button asChild className="flex-1 py-6 rounded-xl">
            <Link href="/san-pham">Tiếp tục mua gạo</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 py-6 rounded-xl">
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
                    Giao tận nơi, đặt hàng qua Zalo OA
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
                  Hệ thống bảo vệ tối ưu: Hóa đơn tự động chuẩn bị. Bạn chỉ cần làm theo hướng dẫn ở bước tiếp theo để gửi qua Zalo siêu tốc.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full gap-2"
              >
                {submitting ? 'Đang xử lý đơn hàng...' : 'Xác nhận đơn hàng & Tiếp tục'}
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
