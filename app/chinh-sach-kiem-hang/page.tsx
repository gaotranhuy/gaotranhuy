import type { Metadata } from 'next';
import { PolicyPage } from '@/components/common/policy-page';

export const metadata: Metadata = {
  title: 'Chính sách kiểm hàng',
  description:
    'Chính sách kiểm hàng của Gạo Trần Huy - Kiểm tra trước khi nhận, điều kiện từ chối nhận và trường hợp không đổi.',
  keywords: [
    'chính sách kiểm hàng',
    'kiểm tra hàng',
    'từ chối nhận',
    'gạo trần huy',
  ],
  alternates: { canonical: '/chinh-sach-kiem-hang' },
  openGraph: {
    title: 'Chính sách kiểm hàng | Gạo Trần Huy',
    description: 'Quy định về kiểm tra hàng hóa trước khi nhận tại Gạo Trần Huy.',
    url: '/chinh-sach-kiem-hang',
    type: 'website',
  },
};

export default function InspectionPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Chính sách"
      title="Chính sách kiểm hàng"
      description="Quy định về kiểm tra hàng hóa trước khi nhận tại Gạo Trần Huy."
      breadcrumbLabel="Chính sách kiểm hàng"
      sections={[
        {
          heading: '1. Kiểm tra hàng trước khi nhận',
          content: [
            'Khách hàng có quyền và được khuyến khích kiểm tra hàng hóa trước khi thanh toán và nhận hàng từ nhân viên giao hàng.',
            'Việc kiểm tra bao gồm: kiểm tra bao bì, số lượng, quy cách sản phẩm và tình trạng hàng hóa (không ẩm mốc, không vỡ, không sai sản phẩm).',
          ],
        },
        {
          heading: '2. Điều kiện từ chối nhận',
          content: [
            'Khách hàng có quyền từ chối nhận hàng trong các trường hợp: sản phẩm bị lỗi, ẩm mốc, vỡ bao bì, sai sản phẩm, sai số lượng so với đơn đặt.',
            'Khi từ chối nhận, khách hàng vui lòng thông báo lý do cho nhân viên giao hàng và liên hệ với Gạo Trần Huy để được hỗ trợ.',
          ],
        },
        {
          heading: '3. Trường hợp không đổi',
          content: [
            'Sản phẩm đã mở bao bì và sử dụng (trừ trường hợp sản phẩm bị lỗi do nhà sản xuất).',
            'Sản phẩm bị hư hỏng do bảo quản sai cách sau khi nhận (ẩm mốc do để nơi ẩm ướt, vỡ do va đập).',
            'Yêu cầu đổi trả sau 7 ngày kể từ ngày nhận hàng.',
          ],
        },
      ]}
    />
  );
}
