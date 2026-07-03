import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, setAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập mật khẩu' },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Mật khẩu không đúng' },
        { status: 401 }
      );
    }

    await setAdminSession();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
