import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase-server';
import { syncToSheet } from '@/lib/sheet-sync';

function revalidateBlogPages() {
  revalidatePath('/', 'layout');
  revalidatePath('/tin-tuc', 'layout');
  revalidatePath('/tin-tuc/[slug]', 'page');
  revalidatePath('/sitemap');
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data || [] });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    let nextNum = 1;
    if (existing && existing.length > 0) {
      const lastId = existing[0].id;
      const match = lastId.match(/^b(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const newId = `b${String(nextNum).padStart(3, '0')}`;

    const insertData = {
      id: newId,
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      category: body.category || '',
      image: body.image || '',
      author: body.author || 'Gạo Trần Huy',
      published_at: body.published_at || new Date().toISOString().split('T')[0],
      reading_time: body.reading_time || 5,
      tags: body.tags || [],
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateBlogPages();
    syncToSheet('upsert', 'blog', data as Record<string, unknown>);

    return NextResponse.json({ post: data });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
