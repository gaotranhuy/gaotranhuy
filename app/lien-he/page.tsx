import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ContactForm } from '@/components/common/contact-form';
import { ContactInfoCards } from '@/components/common/contact-info-cards';
import { contactInfo } from '@/data/site';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description:
    'Liên hệ Gạo Trần Huy - Hotline, Zalo, email và địa chỉ cửa hàng. Giao hàng toàn quốc.',
  alternates: { canonical: '/lien-he' },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Liên hệ"
        title="Kết nối với chúng tôi"
        description="Gọi hotline, nhắn Zalo hoặc gửi email - Gạo Trần Huy luôn sẵn sàng hỗ trợ bạn."
      />
      <div className="container-page py-8">
        <Breadcrumb items={[{ name: 'Liên hệ' }]} className="mb-8" />
        <ContactInfoCards />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <div className="overflow-hidden rounded-2xl border bg-card">
            <iframe
              src={contactInfo.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Gạo Trần Huy"
            />
          </div>
        </div>
      </div>
    </>
  );
}
