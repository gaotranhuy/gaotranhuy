import type { Metadata } from 'next';
import { PolicyPage } from '@/components/common/policy-page';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description:
    'Chính sách bảo mật thông tin cá nhân của Gạo Trần Huy - Mục đích thu thập, phạm vi sử dụng, thời gian lưu trữ và cam kết bảo mật.',
  keywords: [
    'chính sách bảo mật',
    'bảo mật thông tin',
    'gạo trần huy',
    'bảo vệ dữ liệu cá nhân',
  ],
  alternates: { canonical: '/chinh-sach-bao-mat' },
  openGraph: {
    title: 'Chính sách bảo mật | Gạo Trần Huy',
    description:
      'Chính sách bảo mật thông tin cá nhân của Gạo Trần Huy.',
    url: '/chinh-sach-bao-mat',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Chính sách"
      title="Chính sách bảo mật"
      description="Chính sách bảo mật thông tin cá nhân của khách hàng tại Gạo Trần Huy."
      breadcrumbLabel="Chính sách bảo mật"
      sections={[
        {
          heading: '1. Mục đích thu thập thông tin',
          content: [
            'Gạo Trần Huy thu thập thông tin cá nhân của khách hàng nhằm mục đích: xử lý đơn hàng, giao hàng, thanh toán, hỗ trợ khách hàng, gửi thông tin khuyến mãi và cải thiện chất lượng dịch vụ.',
            'Việc thu thập thông tin giúp chúng tôi cung cấp trải nghiệm mua sắm tốt hơn và đảm bảo quyền lợi của khách hàng khi sử dụng dịch vụ.',
          ],
        },
        {
          heading: '2. Thông tin thu thập',
          content: [
            'Chúng tôi thu thập các thông tin bao gồm: họ tên, số điện thoại, email, địa chỉ giao hàng, thông tin thanh toán và lịch sử đơn hàng.',
            'Ngoài ra, chúng tôi có thể thu thập thông tin về thiết bị, trình duyệt và hành vi duyệt web nhằm mục đích phân tích và cải thiện website.',
          ],
        },
        {
          heading: '3. Phạm vi sử dụng thông tin',
          content: [
            'Thông tin cá nhân của khách hàng chỉ được sử dụng cho các mục đích đã nêu trên. Chúng tôi cam kết không bán, cho thuê hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba nhằm mục đích thương mại.',
            'Thông tin chỉ được chia sẻ với đối tác giao hàng hoặc thanh toán khi cần thiết để hoàn thành đơn hàng.',
          ],
        },
        {
          heading: '4. Thời gian lưu trữ',
          content: [
            'Thông tin cá nhân của khách hàng sẽ được lưu trữ trong suốt thời gian khách hàng sử dụng dịch vụ và sau đó theo yêu cầu của pháp luật.',
            'Khi khách hàng yêu cầu xóa thông tin, chúng tôi sẽ xóa hoặc ẩn thông tin khỏi hệ thống trong thời gian hợp lý.',
          ],
        },
        {
          heading: '5. Cam kết bảo mật',
          content: [
            'Gạo Trần Huy cam kết bảo mật thông tin cá nhân của khách hàng bằng các biện pháp kỹ thuật và tổ chức phù hợp.',
            'Chỉ những nhân viên có thẩm quyền mới được tiếp cận thông tin cá nhân của khách hàng và phải tuân thủ nghiêm ngặt chính sách bảo mật.',
          ],
        },
        {
          heading: '6. Quyền của khách hàng',
          content: [
            'Khách hàng có quyền: truy cập, chỉnh sửa, xóa thông tin cá nhân của mình; từ chối nhận thông tin tiếp thị; và khiếu nại về việc xử lý thông tin.',
            'Để thực hiện quyền, khách hàng vui lòng liên hệ với chúng tôi qua thông tin liên hệ dưới đây.',
          ],
        },
      ]}
    />
  );
}
