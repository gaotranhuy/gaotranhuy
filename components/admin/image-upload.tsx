'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  value: string | string[]; // Chấp nhận string (ảnh đơn) hoặc mảng string[] (album)
  onChange: (url: string | string[]) => void; // Callback trả về ảnh đơn hoặc mảng ảnh tùy trường hợp
  label?: string;
  multiple?: boolean; // Thuộc tính kích hoạt chế độ chọn nhiều ảnh
}

export function ImageUpload({ value, onChange, label = 'Hình ảnh', multiple = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hàm xử lý tải danh sách các files được chọn lên Cloudinary
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    
    // 1. Lọc và kiểm tra định dạng + kích thước của từng file ảnh
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" không phải là ảnh hợp lệ`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" quá lớn (tối đa 10MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const toastId = 'upload-cloudinary';
    toast.loading(`Đang tải ${validFiles.length} ảnh lên Cloudinary...`, { id: toastId });

    try {
      // 2. Chạy tải lên đồng thời (Promise.all) giúp tăng tốc độ tải nhiều ảnh cùng lúc
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload-cloudinary', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Tải ảnh "${file.name}" thất bại`);
        return data.url as string;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // 3. Trả kết quả về cho Form cha dựa trên thuộc tính single/multiple
      if (multiple) {
        // Nếu dùng cho Album: gộp danh sách ảnh cũ (nếu có) với danh sách ảnh mới tải lên
        const currentGallery = Array.isArray(value) ? value : [];
        const uniqueUrls = [...currentGallery];
        
        uploadedUrls.forEach(url => {
          if (!uniqueUrls.includes(url)) uniqueUrls.push(url);
        });
        
        onChange(uniqueUrls);
      } else {
        // Nếu dùng cho Ảnh đại diện chính: chỉ lấy ảnh đầu tiên
        onChange(uploadedUrls[0]);
      }

      toast.success('Tải ảnh thành công', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Lỗi kết nối khi tải ảnh', { id: toastId });
    } finally {
      setUploading(false);
    }
  }, [onChange, multiple, value]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Nếu không bật multiple mà cố kéo thả nhiều file, chỉ lấy file đầu tiên
        const filesToUpload = multiple ? Array.from(e.dataTransfer.files) : [e.dataTransfer.files[0]];
        handleFiles(filesToUpload);
      }
    },
    [handleFiles, multiple]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Check xem có dữ liệu preview hiển thị hay không (chỉ hiển thị preview ảnh đơn, album sẽ render ở form cha)
  const isSinglePreview = !multiple && typeof value === 'string' && value;

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
          multiple={multiple} // Kích hoạt chọn nhiều file từ hệ điều hành cùng lúc khi bật multiple
          onChange={handleInputChange}
          className="hidden"
        />

        {isSinglePreview ? (
          <div className="relative w-full">
            <img
              src={value as string}
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
            <span className="text-sm font-medium">Đang xử lý dữ liệu ảnh...</span>
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
            <span className="text-sm font-medium text-center px-2">
              {multiple ? 'Kéo thả các ảnh hoặc click để chọn nhiều ảnh cho Album' : 'Kéo thả ảnh hoặc click để chọn'}
            </span>
            <span className="text-xs">PNG, JPG, WebP (Tối đa 10MB/ảnh)</span>
          </div>
        )}
      </div>
      
      {/* Ô nhập URL thủ công chỉ hiển thị khi upload ảnh đơn */}
      {!multiple && typeof value === 'string' && value && (
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
