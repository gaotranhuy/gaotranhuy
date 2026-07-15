'use client';

import { optimizeCloudinaryUrl, getPlaceholderImage } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

type CloudinarySize = 'thumbnail' | 'product' | 'banner';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  size?: CloudinarySize;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export function CloudinaryImage({
  src,
  alt,
  size = 'product',
  className,
  loading = 'lazy',
  priority = false,
}: CloudinaryImageProps) {
  return (
    <img
      src={optimizeCloudinaryUrl(src, size)}
      alt={alt}
      loading={priority ? 'eager' : loading}
      className={cn('h-full w-full object-cover', className)}
      onError={(e) => {
        const target = e.currentTarget;
        if (target.src !== getPlaceholderImage()) {
          target.src = getPlaceholderImage();
        }
      }}
    />
  );
}
