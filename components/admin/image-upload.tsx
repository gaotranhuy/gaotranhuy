'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Hình ảnh' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File quá lớn (tối đa 10MB)');
      return;
    }

    setUploading(true);
    toast.loading('Đang tải ảnh lên Cloudinary...', { id: 'upload' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-cloudinary', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Tải ảnh thất bại', { id: 'upload' });
        return;
      }

      onChange(data.url);
      toast.success('Tải ảnh thành công', { id: 'upload' });
    } catch {
      toast.error('Lỗi kết nối', { id: 'upload' });
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30 hover:border-primary/50',
          uploading && 'pointer-events-none opacity-60'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {value ? (
          <div className="relative w-full">
            <img
              src={value}
              alt="Preview"
              className="mx-auto max-h-[140px] rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="140" fill="%23f0f0f0"%3E%3Crect width="200" height="140"/%3E%3Ctext x="100" y="75" font-size="14" text-anchor="middle" fill="%23999"%3EPlaceholder%3C/text%3E%3C/svg%3E';
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1 shadow hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {dragOver ? (
                <Upload className="h-6 w-6" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
            </div>
            <span className="text-sm font-medium">
              Kéo thả ảnh hoặc click để chọn
            </span>
            <span className="text-xs">PNG, JPG, WebP (tối đa 10MB)</span>
          </div>
        )}
      </div>
      {value && (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hoặc dán URL ảnh vào đây"
          className="text-xs"
        />
      )}
    </div>
  );
}
