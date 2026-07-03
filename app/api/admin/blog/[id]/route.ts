import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase-server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const supabase = getSupabase();

    const updateData: Record<string, unknown> = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      category: body.category || '',
      image: body.image || '',
      author: body.author || 'Gạo Trần Huy',
      published_at: body.published_at,
      reading_time: body.reading_time || 5,
      tags: body.tags || [],
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = getSupabase();

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
