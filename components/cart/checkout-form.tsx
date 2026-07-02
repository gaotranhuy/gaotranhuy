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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { siteSettings, contactInfo } from '@/data/site';

type PaymentMethod = 'cod' | 'transfer' | 'zalo';

export function CheckoutForm() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [form, setForm] = React.useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [payment, setPayment] = React.useState<PaymentMethod>('cod');
  const [submitted, setSubmitted] = React.useState(false);

  const shippingFee =
    totalPrice >= siteSettings.freeShippingThreshold
      ? 0
      : siteSettings.shippingFee;
  const grandTotal = totalPrice + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;

    const orderText = `🛒 ĐƠN HÀNG GẠO TRẦN HUY\n\n` +
      `👤 Khách: ${form.name}\n` +
      `📞 SĐT: ${form.phone}\n` +
      `📍 Địa chỉ: ${form.address}\n` +
      (form.note ? `📝 Ghi chú: ${form.note}\n` : '') +
      `\n📦 Sản phẩm:\n` +
      items
        .map(
          (i) =>
            `   - ${i.product.name} x${i.quantity}: ${formatPrice(
              i.product.price * i.quantity
            )}`
        )
        .join('\n') +
      `\n\n💰 Tạm tính: ${formatPrice(totalPrice)}\n` +
      `🚚 Phí ship: ${shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}\n` +
      `✅ Tổng: ${formatPrice(grandTotal)}`;

    if (payment === 'zalo') {
      window.open(
        `https://zalo.me/${contactInfo.zalo}?message=${encodeURIComponent(orderText)}`,
        '_blank'
      );
    } else {
      window.open(
        `https://zalo.me/${contactInfo.zalo}?message=${encodeURIComponent(orderText)}`,
        '_blank'
      );
    }

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
          <h2 className="font-display text-2xl font-bold">Đặt hàng thành công!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cảm ơn bạn đã đặt hàng. Chúng tôi đã chuyển bạn đến Zalo để xác nhận
            đơn. Gạo Trần Huy sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/san-pham">Ti tục mua sắm</Link>
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

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">Thông tin giao hàng</h2>
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
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0901 234 567"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Địa chỉ giao hàng <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Số nhà, đường, phường, quận, thành phố"
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
                <Textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Thời gian giao hàng, lưu ý đặc biệt..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">Phương thức thanh toán</h2>
            <div className="grid gap-2">
              {[
                {
                  id: 'cod' as PaymentMethod,
                  label: 'Thanh toán tại nhà (COD)',
                  desc: 'Trả tiền mặt khi nhận hàng',
                  icon: MapPin,
                },
                {
                  id: 'transfer' as PaymentMethod,
                  label: 'Chuyển khoản',
                  desc: 'Chuyển khoản ngân hàng, gửi biên lai',
                  icon: Send,
                },
                {
                  id: 'zalo' as PaymentMethod,
                  label: 'Đặt qua Zalo',
                  desc: 'Chat Zalo để xác nhận đơn',
                  icon: MessageCircle,
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                    payment === method.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={payment === method.id}
                    onChange={() => setPayment(method.id)}
                    className="sr-only"
                  />
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      payment === method.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <method.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{method.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {method.desc}
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 ${
                      payment === method.id
                        ? 'border-primary bg-primary'
                        : 'border-muted'
                    }`}
                  >
                    {payment === method.id && (
                      <Check className="h-full w-full p-0.5 text-primary-foreground" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold">
              Đơn hàng ({totalItems})
            </h2>
            <ul className="max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="line-clamp-1 text-sm font-medium">
                      {item.product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.product.unit}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
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
            <Button type="submit" size="lg" className="mt-5 w-full">
              Xác nhận đặt hàng
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Bằng việc đặt hàng, bạn đồng ý với điều khoản của Gạo Trần Huy.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
