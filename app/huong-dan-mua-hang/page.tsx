import type { Metadata } from 'next';
import { PolicyPage } from '@/components/common/policy-page';
import { contactInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Hướng dẫn mua hàng',
  description:
    'Hướng dẫn mua hàng tại Gạo Trần Huy - Cách đặt hàng qua Website, GrabMart, Shopee, Hotline và Facebook.',
  keywords: [
    'hướng dẫn mua hàng',
    'cách đặt hàng',
    'gạo trần huy',
    'đặt hàng online',
    'mua hàng grabmart',
  ],
  alternates: { canonical: '/huong-dan-mua-hang' },
  openGraph: {
    title: 'Hướng dẫn mua hàng | Gạo Trần Huy',
    description: 'Hướng dẫn cách đặt hàng tại Gạo Trần Huy qua các kênh khác nhau.',
    url: '/huong-dan-mua-hang',
    type: 'website',
  },
};

export default function GuidePage() {
  return (
    <PolicyPage
      eyebrow="Hướng dẫn"
      title="Hướng dẫn mua hàng"
      description="Các cách đặt hàng tại Gạo Trần Huy - Đơn giản, nhanh chóng, tiện lợi."
      breadcrumbLabel="Hướng dẫn mua hàng"
      sections={[
        {
          heading: '1. Đặt hàng qua Website',
          content: [
            'Bước 1: Truy cập website gaotranhuy.vn, chọn sản phẩm mong muốn.',
            'Bước 2: Nhấn "Thêm vào giỏ hàng", sau đó vào giỏ hàng để kiểm tra.',
            'Bước 3: Điền thông tin giao hàng (họ tên, số điện thoại, địa chỉ) và xác nhận đơn.',
            'Bước 4: Chúng tôi sẽ liên hệ để xác nhận đơn và giao hàng.',
          ],
        },
        {
          heading: '2. Đặt hàng qua GrabMart',
          content: [
            'Bước 1: Mở ứng dụng Grab, chọn mục GrabMart.',
            'Bước 2: Tìm kiếm "Gạo Trần Huy" hoặc truy cập link GrabMart của chúng tôi.',
            'Bước 3: Chọn sản phẩm, thêm vào giỏ và thanh toán trên ứng dụng Grab.',
            'Bước 4: Nhận hàng trong vòng 1-2 giờ tại Đà Nẵng.',
          ],
        },
        {
          heading: '3. Đặt hàng qua Shopee',
          content: [
            'Bước 1: Mở ứng dụng Shopee, tìm kiếm "Gạo Trần Huy" hoặc truy cập gian hàng Shopee của chúng tôi.',
            'Bước 2: Chọn sản phẩm, thêm vào giỏ hàng và thanh toán trên Shopee.',
            'Bước 3: Nhận hàng theo thời gian giao của Shopee (toàn quốc).',
          ],
        },
        {
          heading: '4. Đặt hàng qua Hotline',
          content: [
            'Gọi trực tiếp hotline của Gạo Trần Huy để được tư vấn và đặt hàng nhanh chóng.',
            `Hotline: ${contactInfo.phone}`,
            `Giờ làm việc: ${contactInfo.workingHours}`,
          ],
        },
        {
          heading: '5. Đặt hàng qua Facebook',
          content: [
            'Khách hàng có thể nhắn tin trực tiếp qua Fanpage Facebook của Gạo Trần Huy để đặt hàng.',
            `Link Facebook: ${contactInfo.facebook}`,
            'Đội ngũ hỗ trợ sẽ phản hồi và xử lý đơn hàng qua tin nhắn Facebook.',
          ],
        },
      ]}
    />
  );
}
