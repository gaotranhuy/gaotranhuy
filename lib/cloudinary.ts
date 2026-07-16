const CLOUDINARY_CLOUD_NAME = 'f9krxetg';
const CLOUDINARY_UPLOAD_PRESET = 'gaotranhuy';

export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
};

export function getCloudinaryUploadUrl(): string {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

type CloudinarySize = 'thumbnail' | 'product' | 'banner';

const SIZE_MAP: Record<CloudinarySize, number> = {
  thumbnail: 300,
  product: 600,
  banner: 1200,
};

export function optimizeCloudinaryUrl(
  url: string,
  size: CloudinarySize = 'product'
): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const w = SIZE_MAP[size];

  return url.replace(
    '/image/upload/',
    `/image/upload/f_auto,q_auto:good,w_${w},c_limit,dpr_auto,fl_progressive/`
  );
}

export function getPlaceholderImage(): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto:good,w_600,c_limit,dpr_auto/v1/placeholder-product`;
}
