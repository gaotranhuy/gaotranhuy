const CLOUDINARY_CLOUD_NAME = 'f9krxetg';
const CLOUDINARY_UPLOAD_PRESET = 'gaotranhuy';

export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
};

export function getCloudinaryUploadUrl(): string {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

type CloudinaryCrop =
  | 'fill'
  | 'fit'
  | 'limit'
  | 'scale'
  | 'crop'
  | 'thumb'
  | 'mfit'
  | 'mpad';

type CloudinaryGravity =
  | 'auto'
  | 'center'
  | 'face'
  | 'faces'
  | 'north'
  | 'south'
  | 'east'
  | 'west';

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: CloudinaryCrop;
  gravity?: CloudinaryGravity;
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco';
}

const RASTER_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.bmp',
];

function isRasterImage(url: string): boolean {
  const lower = url.toLowerCase().split('?')[0];
  return RASTER_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function buildTransform(opts: CloudinaryTransformOptions): string {
  const crop = opts.crop ?? 'limit';
  const parts: string[] = [
    'f_auto',
    `q_${opts.quality ?? 'auto'}`,
    'dpr_auto',
  ];
  if (opts.width) parts.push(`w_${opts.width}`);
  if (opts.height) parts.push(`h_${opts.height}`);
  parts.push(`c_${crop}`);
  if (crop !== 'limit' && crop !== 'scale') {
    parts.push(`g_${opts.gravity ?? 'auto'}`);
  }
  return parts.join(',');
}

function replaceCloudinaryTransform(
  url: string,
  transform: string
): string {
  const uploadMarker = '/image/upload/';
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;
  const prefix = url.slice(0, idx + uploadMarker.length);
  const afterUpload = url.slice(idx + uploadMarker.length);
  if (/^v\d+\//.test(afterUpload)) {
    return `${prefix}${transform}/${afterUpload}`;
  }
  const slashIdx = afterUpload.indexOf('/');
  if (slashIdx === -1) return url;
  return `${prefix}${transform}/${afterUpload.slice(slashIdx + 1)}`;
}

export function optimizeCloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url) return url;

  if (url.includes('res.cloudinary.com')) {
    return replaceCloudinaryTransform(url, buildTransform(options));
  }

  if (/^https?:\/\//.test(url) && isRasterImage(url)) {
    const cleanUrl = url.split('?')[0];
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${buildTransform(options)}/${cleanUrl}`;
  }

  return url;
}

export function getPlaceholderImage(): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${buildTransform({
    width: 600,
    crop: 'limit',
  })}/v1/placeholder-product`;
}

export const cloudinaryThumb = (url: string) =>
  optimizeCloudinaryUrl(url, { width: 150, crop: 'limit', quality: 'auto:eco' });

export const cloudinaryCard = (url: string) =>
  optimizeCloudinaryUrl(url, { width: 315, crop: 'limit', quality: 'auto:eco' });

export const cloudinaryProduct = (url: string) =>
  optimizeCloudinaryUrl(url, { width: 800, crop: 'limit', quality: 'auto' });

export const cloudinaryBanner = (url: string) =>
  optimizeCloudinaryUrl(url, { width: 1200, crop: 'limit' });

export const cloudinaryHero = (url: string) =>
  optimizeCloudinaryUrl(url, { width: 600, crop: 'fill' });
