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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { siteSettings, contactInfo } from '@/data/site';

type ShippingRegion = 'da-nang' | 'nationwide';

// Danh sách 12 Phường và 3 Xã mới chuẩn địa giới hành chính Đà Nẵng
const DANANG_WARDS = [
  'Phường Hải Châu', 'Phường Hòa Cường', 'Phường Thanh Khê', 'Phường An Khê',
  'Phường An Hải', 'Phường Sơn Trà', 'Phường Cẩm Lệ', 'Phường Hòa Vang',
  'Phường Khuê Mỹ', 'Phường Mỹ An', 'Phường Hòa Quý', 'Phường Hòa Hiệp',
  'Xã Hòa Bắc', 'Xã Hòa Ninh', 'Xã Hòa Nhơn'
];

export function CheckoutForm() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [region, setRegion] = React.useState<ShippingRegion>('da-nang');
  
  // Tách biệt ô nhập Phường (để gợi ý) và Địa chỉ chi tiết
  const [wardInput, setWardInput] = React.useState('');
  const [showWardSuggestions, setShowWardSuggestions] = React.useState(false);
  
  const [form, setForm] = React.useState({
    name: '',
    phone: '',
    address: '', // Số nhà, tên đường
    note: '',
  });
  
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const shippingFee =
    totalPrice >= siteSettings.freeShippingThreshold
      ? 0
      : siteSettings.shippingFee;
  const grandTotal = totalPrice + shippingFee;
  const missingForFreeShip = siteSettings.freeShippingThreshold - totalPrice;

  // Lọc danh sách phường dựa trên ký tự khách nhập vào ô Phường
  const filteredWards = DANANG_WARDS.filter((w) =>
    w.toLowerCase().includes(wardInput.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !wardInput) return;

    setSubmitting(true);

    // 1. Gom thông tin sản phẩm đơn hàng dạng danh sách sạch sẽ
    const productLines = items
      .map((item) => {
        const i = item as any;
        const name = i.name || i.product?.name || 'Sản phẩm Gạo';
        const price = Number(i.price || i.product?.price || 0);
        const quantity = Number(i.quantity || 1);
        return `• ${name} x${quantity}: ${formatPrice(price * quantity)}`;
      })
      .join('\n');

    // Nối Phường nhập tay và Số nhà/Đường thành Địa chỉ đầy đủ
    const fullAddress = `${form.address}, ${wardInput}, TP. Đà Nẵng`;

    // 2. Thiết kế mẫu tin nhắn báo đơn hàng gửi về Telegram
    const telegramMessage = 
      `🌾 CÓ ĐƠN HÀNG GẠO MỚI! 🌾\n\n` +
      `👤 Khách hàng: ${form.name}\n` +
      `📞 Số điện thoại: ${form.phone}\n` +
      `📍 Địa chỉ giao: ${fullAddress}\n` +
      (form.note ? `📝 Ghi chú: ${form.note}\n` : '') +
      `\n📦 SẢN PHẨM ĐẶT MUA:\n${productLines}\n\n` +
      `-----------------------------\n` +
      `💰 Tiền hàng: ${formatPrice(totalPrice)}\n` +
      `🚚 Phí vận chuyển: ${shippingFee === 0 ? 'Miễn phí (Free Ship)' : formatPrice(shippingFee)}\n` +
      `💵 TỔNG CỘNG THANH TOÁN: ${formatPrice(grandTotal)}`;

    try {
      const TELEGRAM_BOT_TOKEN = '8857624974:AAEYfXquqPEjSIOCUvTivWE2tdkNMThNmkw'; 
      const TELEGRAM_CHAT_ID = '8850729815';

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
        }),
      });
    } catch (err) {
      console.error('Lỗi gửi thông báo Telegram:', err);
    } finally {
      clearCart();
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  // MÀN HÌNH THÀNH CÔNG GIAO DIỆN ĐẸP 5 SAO
  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-3xl border bg-card p-6 py-12 text-center shadow-xl border-gray-100">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-black text-emerald-600 tracking-tight">
            ĐẶT HÀNG THÀNH CÔNG!
          </h2>
          <p className="text-sm text-gray-700 px-4 leading-relaxed font-medium">
            Cảm ơn bạn đã lựa chọn mua sắm tại cửa hàng Gạo Trần Huy.
          </p>
          <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl p-4 text-xs mx-4 text-left mt-3">
            📞 Đơn hàng của quý khách đã được hệ thống truyền đạt đến bộ phận xử lý của shop. <strong>Cửa hàng Gạo Trần Huy</strong> sẽ trực tiếp gọi điện thoại vào số <span className="underline font-bold text-emerald-700">{form.phone || 'của bạn'}</span> để xác nhận đơn và xếp lịch giao gạo tận nhà ngay nhé!
          </div>
        </div>
        <div className="flex gap-3 w-full px-4 mt-2">
          <Button asChild className="flex-1 py-6 rounded-xl bg-emerald-600 hover:bg-emerald-700">
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
                    Giao tận nơi, đặt nhận đơn tự động nhanh chóng
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
              <div className="rounded-2xl border bg-card p-5 space-y-4">
                <h2 className="text-base font-semibold">
                  Thông tin giao hàng
                </h2>

                {/* Thanh thông báo tiến độ Free Ship thông minh tích hợp trong Form */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  {shippingFee === 0 ? (
                    <p className="font-semibold text-emerald-700 flex items-center gap-1.5 text-sm">
                      🎉 Tuyệt vời! Đơn hàng của bạn đã đạt mốc và được áp dụng gói <strong>Miễn phí giao hàng</strong>.
                    </p>
                  ) : (
                    <p className="font-medium">
                      💡 Mẹo nhỏ: Mua thêm <span className="text-orange-600 font-bold">{formatPrice(missingForFreeShip)}</span> tiền gạo nữa để được kích hoạt gói <span className="font-bold text-orange-600">Miễn phí ship</span> nhé ní!
                    </p>
                  )}
                  <div className="w-full bg-gray-200/80 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min((totalPrice / siteSettings.freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>

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

                  {/* Thiết kế trường Phường/Xã nhập tay kèm bảng tìm kiếm nhanh */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 relative">
                      <label className="text-sm font-medium">
                        Chọn Phường / Xã <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          required
                          value={wardInput}
                          onChange={(e) => {
                            setWardInput(e.target.value);
                            setShowWardSuggestions(true);
                          }}
                          onFocus={() => setShowWardSuggestions(true)}
                          placeholder="Gõ để tìm phường (VD: Hải Châu)..."
                          className="pl-10"
                        />
                      </div>
                      
                      {/* Danh sách gợi ý thông minh đổ xuống */}
                      {showWardSuggestions && wardInput && filteredWards.length > 0 && (
                        <ul className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] max-h-48 overflow-y-auto rounded-xl border bg-white py-1.5 shadow-lg text-sm">
                          {filteredWards.map((w) => (
                            <li key={w}>
                              <button
                                type="button"
                                onClick={() => {
                                  setWardInput(w);
                                  setShowWardSuggestions(false);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors font-medium text-gray-800"
                              >
                                {w}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Số nhà, tên đường <span className="text-destructive">*</span>
                      </label>
                      <Input
                        required
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder="Ví dụ: 123 Nguyễn Chí Thanh"
                      />
                    </div>
                  </div>

                  {/* Hiển thị chi phí ship trực quan tương tác ngay trong form */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <Truck className="w-4 h-4 text-gray-400" />
                      Phí giao hàng dự kiến:
                    </span>
                    <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'text-gray-900 font-bold'}>
                      {shippingFee === 0 ? 'Miễn phí vận chuyển' : formatPrice(shippingFee)}
                    </span>
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

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {submitting ? 'Đang gửi đơn hàng...' : `Xác nhận đặt đơn ngay (${formatPrice(grandTotal)})`}
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

        {/* Tóm tắt đơn hàng bên phải */}
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
                    <span className="text-emerald-600 font-bold">Miễn phí</span>
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
