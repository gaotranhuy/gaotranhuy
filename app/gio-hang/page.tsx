import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';
import { Breadcrumb } from '@/components/common/breadcrumb';

export const metadata: Metadata = {
  title: 'Giỏ hàng',
  description: 'Xem lại các sản phẩm trong giỏ hàng và tiến hành đặt hàng.',
  alternates: { canonical: '/gio-hang' },
};

export default function CartPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[{ name: 'Giỏ hàng' }]}
        className="mb-6"
      />
      <CartView />
    </div>
  );
}
