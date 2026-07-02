import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/cart/checkout-form';
import { Breadcrumb } from '@/components/common/breadcrumb';

export const metadata: Metadata = {
  title: 'Đặt hàng',
  description:
    'Điền thông tin để đặt hàng. Giao hàng tận nơi, thanh toán tại nhà hoặc chuyển khoản.',
  alternates: { canonical: '/dat-hang' },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ name: 'Đặt hàng' }]} className="mb-6" />
      <CheckoutForm />
    </div>
  );
}
