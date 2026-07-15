'use client';

import dynamic from 'next/dynamic';

const FloatingContact = dynamic(
  () => import('@/components/common/floating-contact').then((m) => m.FloatingContact),
  { ssr: false }
);

export function FloatingContactWrapper() {
  return <FloatingContact />;
}
