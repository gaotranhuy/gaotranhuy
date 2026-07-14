import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ContactForm } from '@/components/common/contact-form';
import { ContactInfoCards } from '@/components/common/contact-info-cards';
import { contactInfo, businessInfo } from '@/data/site';
import { Building2, MapPin, Phone, Mail, FileText } from 'lucide-react';

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

        {/* Business Owner Info */}
        <div className="mt-12">
          <div className="rounded-2xl border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Thông tin chủ sở hữu website
                </h2>
                <p className="text-sm text-muted-foreground">
                  Hộ kinh doanh cung cấp sản phẩm và dịch vụ trên website
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tên hộ kinh doanh</div>
                  <div className="text-sm font-semibold text-foreground">{businessInfo.name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Địa chỉ</div>
                  <div className="text-sm font-semibold text-foreground">{businessInfo.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Hotline</div>
                  <div className="text-sm font-semibold text-foreground">{businessInfo.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-semibold text-foreground">{businessInfo.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Mã số thuế</div>
                  <div className="text-sm font-semibold text-foreground">
                    {businessInfo.taxCode || 'Đang cập nhật'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
