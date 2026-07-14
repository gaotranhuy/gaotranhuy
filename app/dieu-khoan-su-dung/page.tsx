import type { Metadata } from 'next';
import { PolicyPage } from '@/components/common/policy-page';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description:
    'Điều khoản sử dụng website Gạo Trần Huy - Quyền khách hàng, quyền website, điều khoản đặt hàng, thanh toán, miễn trừ trách nhiệm và giải quyết tranh chấp.',
  keywords: [
    'điều khoản sử dụng',
    'điều khoản',
    'gạo trần huy',
    'quyền khách hàng',
    'giải quyết tranh chấp',
  ],
  alternates: { canonical: '/dieu-khoan-su-dung' },
  openGraph: {
    title: 'Điều khoản sử dụng | Gạo Trần Huy',
    description: 'Điều khoản và điều kiện sử dụng website Gạo Trần Huy.',
    url: '/dieu-khoan-su-dung',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Pháp lý"
      title="Điều khoản sử dụng"
      description="Điều khoản và điều kiện sử dụng website và dịch vụ của Gạo Trần Huy."
      breadcrumbLabel="Điều khoản sử dụng"
      sections={[
        {
          heading: '1. Quyền của khách hàng',
          content: [
            'Khách hàng có quyền truy cập, xem sản phẩm, đặt hàng, thanh toán và nhận hàng từ Gạo Trần Huy.',
            'Khách hàng có quyền khiếu nại, đổi trả hàng hóa theo chính sách đổi trả và kiểm hàng.',
            'Khách hàng có quyền yêu cầu bảo mật thông tin cá nhân theo chính sách bảo mật.',
          ],
        },
        {
          heading: '2. Quyền của website',
          content: [
            'Gạo Trần Huy có quyền từ chối đơn hàng, hủy đơn hàng hoặc khóa tài khoản khách hàng nếu phát hiện hành vi gian lận hoặc vi phạm điều khoản.',
            'Gạo Trần Huy có quyền thay đổi giá, sản phẩm, chính sách mà không cần thông báo trước (trừ đơn hàng đã xác nhận).',
          ],
        },
        {
          heading: '3. Điều khoản đặt hàng',
          content: [
            'Khi đặt hàng trên website, khách hàng cung cấp thông tin chính xác và đầy đủ để chúng tôi xử lý đơn.',
            'Đơn hàng được coi là chính thức sau khi được Gạo Trần Huy xác nhận qua điện thoại hoặc tin nhắn.',
          ],
        },
        {
          heading: '4. Thanh toán',
          content: [
            'Khách hàng đồng ý thanh toán theo các phương thức được Gạo Trần Huy hỗ trợ: tiền mặt (COD), chuyển khoản, GrabMart, Shopee.',
            'Chi tiết thanh toán xem thêm tại Chính sách thanh toán.',
          ],
        },
        {
          heading: '5. Miễn trừ trách nhiệm',
          content: [
            'Gạo Trần Huy không chịu trách nhiệm về thiệt hại gián tiếp, phát sinh từ việc sử dụng sản phẩm không đúng hướng dẫn.',
            'Gạo Trần Huy không chịu trách nhiệm về sự cố kỹ thuật, mất mạng, hoặc lỗi do bên thứ ba (đơn vị vận chuyển, cổng thanh toán).',
          ],
        },
        {
          heading: '6. Giải quyết tranh chấp',
          content: [
            'Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết bằng thương lượng giữa khách hàng và Gạo Trần Huy.',
            'Trường hợp không thỏa thuận được, tranh chấp sẽ được giải quyết theo pháp luật Việt Nam.',
          ],
        },
      ]}
    />
  );
}
