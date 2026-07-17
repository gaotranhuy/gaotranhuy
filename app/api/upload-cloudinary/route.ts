import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { getCloudinaryUploadUrl, CLOUDINARY_CONFIG } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file' },
        { status: 400 }
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const response = await fetch(getCloudinaryUploadUrl(), {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Cloudinary upload failed: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    const optimizedUrl = (data.secure_url as string).replace(
      '/image/upload/',
      '/image/upload/f_auto,q_auto,dpr_auto,w_800,c_limit/'
    );

    return NextResponse.json({
      url: optimizedUrl,
      public_id: data.public_id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lỗi server' },
      { status: 500 }
    );
  }
}
