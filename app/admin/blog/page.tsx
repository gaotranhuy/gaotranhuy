import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { BlogManager } from '@/components/admin/blog-manager';

export default async function AdminBlogPage() {
  const loggedIn = await isAdmin();
  if (!loggedIn) redirect('/admin/login');

  return <BlogManager />;
}
