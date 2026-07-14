import type { Metadata } from 'next';
import { PolicyPage } from '@/components/common/policy-page';

export const metadata: Metadata = {
  title: 'Chính sách đổi trả',
  description:
    'Chính sách đổi trả hàng hóa của Gạo Trần Huy - Điều kiện đổi, hàng lỗi, hàng sai, quy trình và thời gian xử lý.',
  keywords: [
    'chính sách đổi trả',
    'đổi hàng',
    'trả hàng',
    'gạo trần huy',
    'hàng lỗi',
  ],
  alternates: { canonical: '/chinh-sach-doi-tra' },
  openGraph: {
    title: 'Chính sách đổi trả | Gạo Trần Huy',
    description: 'Điều kiện đổi trả và quy trình xử lý tại Gạo Trần Huy.',
    url: '/chinh-sach-doi-tra',
    type: 'website',
  },
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Chính sách"
      title="Chính sách đổi trả"
      description="Quy định về đổi trả hàng hóa tại Gạo Trần Huy."
      breadcrumbLabel="Chính sách đổi trả"
      sections={[
        {
          heading: '1. Điều kiện đổi trả',
          content: [
            'Sản phẩm còn nguyên bao bì, không bị hư hỏng do sử dụng hoặc bảo quản sai cách.',
            'Khách hàng có yêu cầu đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.',
            'Có hóa đơn mua hàng hoặc bằng chứng đặt hàng hợp lệ.',
          ],
        },
        {
          heading: '2. Đổi trả hàng lỗi',
          content: [
            'Trường hợp sản phẩm bị lỗi do nhà sản xuất (ẩm mốc, vỡ bao bì, sai quy cách), Gạo Trần Huy sẽ đổi mới miễn phí.',
            'Khách hàng vui lòng gửi hình ảnh sản phẩm lỗi để chúng tôi xác nhận và xử lý.',
          ],
        },
        {
          heading: '3. Đổi trả hàng sai',
          content: [
            'Trường hợp giao sai sản phẩm, sai số lượng hoặc sai quy cách so với đơn đặt, chúng tôi sẽ đổi đúng sản phẩm hoặc hoàn tiền.',
            'Khách hàng cần thông báo cho chúng tôi trong vòng 48 giờ kể từ khi nhận hàng.',
          ],
        },
        {
          heading: '4. Quy trình đổi trả',
          content: [
            'Bước 1: Liên hệ với Gạo Trần Huy qua Hotline hoặc Zalo để thông báo yêu cầu đổi trả.',
            'Bước 2: Gửi hình ảnh sản phẩm và mô tả lý do đổi trả.',
            'Bước 3: Chúng tôi xác nhận và hướng dẫn gửi lại sản phẩm.',
            'Bước 4: Sau khi nhận sản phẩm, chúng tôi tiến hành đổi mới hoặc hoàn tiền.',
          ],
        },
        {
          heading: '5. Thời gian xử lý',
          content: [
            'Đổi trả tại Đà Nẵng: 1-3 ngày làm việc.',
            'Đổi trả toàn quốc: 5-10 ngày làm việc tùy đơn vị vận chuyển.',
            'Hoàn tiền: 3-7 ngày làm việc kể từ khi nhận lại sản phẩm.',
          ],
        },
      ]}
    />
  );
}
