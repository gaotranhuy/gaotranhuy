'use client';

import dynamic from 'next/dynamic';

const CartDrawer = dynamic(
  () => import('@/components/cart/cart-drawer').then((m) => m.CartDrawer)
);

export function CartClient() {
  return <CartDrawer />;
}
