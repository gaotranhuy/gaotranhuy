const CLOUDINARY_CLOUD_NAME = 'f9krxetg';
const CLOUDINARY_UPLOAD_PRESET = 'gaotranhuy';

export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
};

export function getCloudinaryUploadUrl(): string {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

export type CloudinarySize = 'thumbnail' | 'product' | 'banner';

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

  const width = SIZE_MAP[size];

  const transform = `f_auto,q_auto:good,dpr_auto,w_${width},c_limit,g_auto`;

  return url.replace('/image/upload/', `/image/upload/${transform}/`);
}

export function getPlaceholderImage(): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto:good,dpr_auto,w_600,c_limit,g_auto/v1/placeholder-product`;
}
