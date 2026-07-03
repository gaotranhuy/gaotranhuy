import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { ProductsManager } from '@/components/admin/products-manager';

export default async function AdminProductsPage() {
  const loggedIn = await isAdmin();
  if (!loggedIn) redirect('/admin/login');

  return <ProductsManager />;
}
