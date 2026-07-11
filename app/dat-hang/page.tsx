import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/cart/checkout-form';
import { OrderHistory } from '@/components/cart/order-history';
import { Breadcrumb } from '@/components/common/breadcrumb';

export const metadata: Metadata = {
  title: 'Đặt hàng',
  description:
    'Điền thông tin để đặt hàng. Giao hàng tận nơi, thanh toán tại nhà hoặc chuyển khoản.',
  alternates: { canonical: '/dat-hang' },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 space-y-10">
      <div>
        <Breadcrumb items={[{ name: 'Đặt hàng' }]} className="mb-6" />
        <CheckoutForm />
      </div>

      {/* TÍCH HỢP XEM LẠI TOÀN BỘ DANH SÁCH ĐƠN HÀNG ĐÃ ĐẶT GẦN ĐÂY */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-2 sm:p-6">
        <OrderHistory />
      </div>
    </div>
  );
}
