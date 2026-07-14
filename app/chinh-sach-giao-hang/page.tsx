import type { Metadata } from 'next';
import { PolicyPage } from '@/components/common/policy-page';

export const metadata: Metadata = {
  title: 'Chính sách giao hàng',
  description:
    'Chính sách giao hàng của Gạo Trần Huy - Phạm vi giao hàng nội thành Đà Nẵng, toàn quốc, GrabMart, Shopee, thời gian và phí giao hàng.',
  keywords: [
    'chính sách giao hàng',
    'giao hàng Đà Nẵng',
    'giao hàng toàn quốc',
    'gạo trần huy',
    'phí giao hàng',
  ],
  alternates: { canonical: '/chinh-sach-giao-hang' },
  openGraph: {
    title: 'Chính sách giao hàng | Gạo Trần Huy',
    description: 'Phạm vi giao hàng, thời gian và phí giao hàng của Gạo Trần Huy.',
    url: '/chinh-sach-giao-hang',
    type: 'website',
  },
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Chính sách"
      title="Chính sách giao hàng"
      description="Quy định về phạm vi giao hàng, thời gian và phí giao hàng tại Gạo Trần Huy."
      breadcrumbLabel="Chính sách giao hàng"
      sections={[
        {
          heading: '1. Phạm vi giao hàng',
          content: [
            'Gạo Trần Huy giao hàng trên toàn lãnh thổ Việt Nam, bao gồm nội thành Đà Nẵng và các tỉnh thành khác.',
            'Khách hàng có thể đặt hàng qua Website, GrabMart, Shopee, Hotline hoặc Facebook.',
          ],
        },
        {
          heading: '2. Giao hàng nội thành Đà Nẵng',
          content: [
            'Đơn hàng nội thành Đà Nẵng được giao trong ngày, thường trong vòng 2-4 giờ kể từ khi xác nhận đơn.',
            'Phí giao hàng nội thành: 20.000đ - 30.000đ tùy khu vực. Miễn phí giao hàng cho đơn từ 500.000đ.',
          ],
        },
        {
          heading: '3. Giao hàng toàn quốc',
          content: [
            'Đơn hàng toàn quốc được giao qua các đơn vị vận chuyển uy tín (GHTK, Viettel Post, v.v.).',
            'Thời gian giao hàng: 2-5 ngày làm việc tùy tỉnh thành. Phí giao hàng tính theo bảng giá của đơn vị vận chuyển.',
          ],
        },
        {
          heading: '4. Giao hàng qua GrabMart',
          content: [
            'Khách hàng tại Đà Nẵng có thể đặt hàng qua GrabMart để được giao nhanh trong vòng 1-2 giờ.',
            'Phí giao hàng và thời gian giao được tính tự động bởi GrabMart theo khoảng cách.',
          ],
        },
        {
          heading: '5. Giao hàng qua Shopee',
          content: [
            'Khách hàng có thể đặt hàng qua gian hàng Shopee của Gạo Trần Huy để được giao hàng toàn quốc.',
            'Phí giao hàng và thời gian giao theo chính sách của Shopee và đơn vị vận chuyển.',
          ],
        },
        {
          heading: '6. Thời gian giao hàng',
          content: [
            'Chúng tôi xử lý đơn hàng từ 7:00 - 20:00 mỗi ngày. Đơn hàng sau 20:00 sẽ được xử lý vào sáng hôm sau.',
            'Thời gian giao hàng có thể thay đổi do điều kiện thời tiết hoặc lịch của đơn vị vận chuyển.',
          ],
        },
        {
          heading: '7. Phí giao hàng',
          content: [
            'Miễn phí giao hàng cho đơn hàng từ 500.000đ (nội thành Đà Nẵng).',
            'Phí giao hàng toàn quốc được tính tự động khi thanh toán, tùy thuộc vào trọng lượng và khoảng cách.',
          ],
        },
        {
          heading: '8. Kiểm tra hàng',
          content: [
            'Khách hàng có quyền kiểm tra hàng trước khi nhận. Nếu phát hiện hàng lỗi, sai hoặc hư hỏng, khách hàng có quyền từ chối nhận và yêu cầu đổi trả.',
            'Vui lòng xem thêm Chính sách kiểm hàng để biết chi tiết.',
          ],
        },
      ]}
    />
  );
}
