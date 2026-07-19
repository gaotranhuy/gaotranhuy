'use client';

import { Toaster } from '@/components/ui/sonner';
import { CartClient } from '@/components/cart/cart-client';
import { BackToTop } from '@/components/layout/back-to-top';

export function ClientOnly() {
  return (
    <>
      <CartClient />
      <BackToTop />
      <Toaster position="top-center" richColors />
    </>
  );
}
