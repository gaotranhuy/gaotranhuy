import type { Metadata } from 'next';
import { PolicyPage } from '@/components/common/policy-page';

export const metadata: Metadata = {
  title: 'Chính sách thanh toán',
  description:
    'Chính sách thanh toán của Gạo Trần Huy - Thanh toán tiền mặt, chuyển khoản, GrabMart, Shopee và quy trình xác nhận đơn hàng.',
  keywords: [
    'chính sách thanh toán',
    'thanh toán tiền mặt',
    'chuyển khoản',
    'gạo trần huy',
    'phương thức thanh toán',
  ],
  alternates: { canonical: '/chinh-sach-thanh-toan' },
  openGraph: {
    title: 'Chính sách thanh toán | Gạo Trần Huy',
    description: 'Phương thức thanh toán và xác nhận đơn hàng tại Gạo Trần Huy.',
    url: '/chinh-sach-thanh-toan',
    type: 'website',
  },
};

export default function PaymentPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Chính sách"
      title="Chính sách thanh toán"
      description="Các phương thức thanh toán và quy trình xác nhận đơn hàng tại Gạo Trần Huy."
      breadcrumbLabel="Chính sách thanh toán"
      sections={[
        {
          heading: '1. Thanh toán tiền mặt',
          content: [
            'Khách hàng thanh toán tiền mặt khi nhận hàng (COD) với nhân viên giao hàng.',
            'Phương thức này áp dụng cho đơn hàng giao trực tiếp tại Đà Nẵng và toàn quốc.',
          ],
        },
        {
          heading: '2. Thanh toán chuyển khoản',
          content: [
            'Khách hàng có thể chuyển khoản trước qua ngân hàng. Thông tin tài khoản sẽ được cung cấp khi đặt hàng.',
            'Sau khi chuyển khoản, vui lòng gửi biên lai qua Zalo hoặc Hotline để chúng tôi xác nhận đơn hàng.',
          ],
        },
        {
          heading: '3. Thanh toán qua GrabMart',
          content: [
            'Khách hàng đặt hàng qua GrabMart có thể thanh toán trực tiếp trên ứng dụng Grab bằng thẻ tín dụng, ví Grab hoặc tiền mặt khi nhận hàng.',
            'Mọi giao dịch qua GrabMart tuân theo chính sách thanh toán của Grab.',
          ],
        },
        {
          heading: '4. Thanh toán qua Shopee',
          content: [
            'Khách hàng đặt hàng qua Shopee có thể thanh toán bằng các phương thức của Shopee: ShopeePay, thẻ tín dụng, ATM hoặc COD.',
            'Mọi giao dịch qua Shopee tuân theo chính sách thanh toán của Shopee.',
          ],
        },
        {
          heading: '5. Xác nhận đơn hàng',
          content: [
            'Sau khi đặt hàng, chúng tôi sẽ liên hệ với khách hàng qua điện thoại để xác nhận đơn trong vòng 1-2 giờ.',
            'Đơn hàng được coi là chính thức sau khi được xác nhận. Nếu không liên hệ được, đơn hàng có thể bị hủy.',
          ],
        },
      ]}
    />
  );
}
