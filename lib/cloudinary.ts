const CLOUDINARY_CLOUD_NAME = 'f9krxetg';
const CLOUDINARY_UPLOAD_PRESET = 'gaotranhuy';

export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
};

export function getCloudinaryUploadUrl(): string {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

export function optimizeCloudinaryUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace(
    '/image/upload/',
    '/image/upload/f_webp,q_auto:best,w_800,h_800,c_limit/'
  );
}

export function getPlaceholderImage(): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/placeholder-product`;
}
