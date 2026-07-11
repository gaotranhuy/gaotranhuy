import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';
import { OrderHistory } from '@/components/cart/order-history';
import { Breadcrumb } from '@/components/common/breadcrumb';

export const metadata: Metadata = {
  title: 'Giỏ hàng',
  description: 'Xem lại các sản phẩm trong giỏ hàng và tiến hành đặt hàng.',
  alternates: { canonical: '/gio-hang' },
};

export default function CartPage() {
  return (
    <div className="container-page py-8 space-y-10">
      <div>
        <Breadcrumb
          items={[{ name: 'Giỏ hàng' }]}
          className="mb-6"
        />
        <CartView />
      </div>

      {/* TÍCH HỢP HIỂN THỊ DANH SÁCH LỊCH SỬ ĐƠN HÀNG ĐÃ MUA */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-2 sm:p-6">
        <OrderHistory />
      </div>
    </div>
  );
}
