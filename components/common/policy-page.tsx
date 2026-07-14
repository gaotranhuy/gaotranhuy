import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { contactInfo } from '@/data/site';

export interface PolicySection {
  heading: string;
  content: string[];
}

export interface PolicyPageProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  sections: PolicySection[];
  metadata: Metadata;
}

export function PolicyPage({
  eyebrow,
  title,
  description,
  breadcrumbLabel,
  sections,
}: PolicyPageProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="container-page py-8">
        <Breadcrumb items={[{ name: breadcrumbLabel }]} className="mb-8" />
        <div className="mx-auto max-w-3xl">
          {sections.map((section, i) => (
            <div key={i} className="mb-8">
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {section.content.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-10 rounded-2xl border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground">Thông tin liên hệ</h3>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <p>Hotline: <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="font-medium text-primary hover:underline">{contactInfo.phone}</a></p>
              <p>Email: <a href={`mailto:${contactInfo.email}`} className="font-medium text-primary hover:underline">{contactInfo.email}</a></p>
              <p>Địa chỉ: {contactInfo.address}</p>
              <p>Giờ làm việc: {contactInfo.workingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
