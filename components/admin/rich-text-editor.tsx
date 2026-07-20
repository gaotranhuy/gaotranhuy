'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  CheckSquare,
  Table as TableIcon,
  Image as ImageIcon,
  Eye,
  Pencil,
  Columns2,
  Maximize,
  Minimize,
  Undo2,
  Redo2,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MarkdownRenderer = dynamic(
  () => import('@/components/blog/markdown-renderer').then((m) => m.MarkdownRenderer),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground">Đang tải preview...</p> }
);

export interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  draftKey?: string;
}

type ViewMode = 'edit' | 'preview' | 'split';

interface UploadItem {
  id: string;
  file: File;
  status: 'uploading' | 'done' | 'error';
  url?: string;
  alt: string;
  caption: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function RichTextEditor({ value, onChange, draftKey = 'blog-draft' }: RichTextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const undoStack = React.useRef<string[]>([]);
  const redoStack = React.useRef<string[]>([]);
  const lastValue = React.useRef<string>(value);

  const [viewMode, setViewMode] = React.useState<ViewMode>('edit');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [wordCount, setWordCount] = React.useState(0);
  const [charCount, setCharCount] = React.useState(0);
  const [uploads, setUploads] = React.useState<UploadItem[]>([]);
  const [savedTime, setSavedTime] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    if (value !== textareaRef.current?.value) {
      if (textareaRef.current) textareaRef.current.value = value;
      lastValue.current = value;
      updateCounts(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  React.useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved && saved !== value && saved.length > 0) {
      const recover = confirm('Phát hiện bản nháp chưa lưu. Khôi phục?');
      if (recover) {
        onChange(saved);
        toast.success('Đã khôi phục bản nháp');
      } else {
        localStorage.removeItem(draftKey);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (value === lastValue.current) return;
    lastValue.current = value;
    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, value);
      setSavedTime(new Date().toLocaleTimeString('vi-VN'));
    }, 1500);
    return () => clearTimeout(timer);
  }, [value, draftKey]);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const pushUndo = () => {
    undoStack.current.push(lastValue.current);
    if (undoStack.current.length > 100) undoStack.current.shift();
    redoStack.current = [];
  };

  const handleUndo = () => {
    const prev = undoStack.current.pop();
    if (prev !== undefined) {
      redoStack.current.push(value);
      onChange(prev);
      updateCounts(prev);
    }
  };

  const handleRedo = () => {
    const next = redoStack.current.pop();
    if (next !== undefined) {
      undoStack.current.push(value);
      onChange(next);
      updateCounts(next);
    }
  };

  const insertAtCursor = (before: string, after = '', placeholder = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    pushUndo();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    updateCounts(newText);
    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + before.length + selectedText.length + after.length;
      ta.setSelectionRange(
        selectedText ? start + before.length : start + before.length,
        selectedText ? start + before.length + selectedText.length : cursorPos
      );
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    pushUndo();
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newText);
    updateCounts(newText);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  const insertBlock = (block: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    pushUndo();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const prefix = start > 0 && value[start - 1] !== '\n' ? '\n\n' : '';
    const suffix = value[end] && value[end] !== '\n' ? '\n\n' : '';
    const newText = value.substring(0, start) + prefix + block + suffix + value.substring(end);
    onChange(newText);
    updateCounts(newText);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + prefix.length + block.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const actions = {
    bold: () => insertAtCursor('**', '**', 'chữ in đậm'),
    italic: () => insertAtCursor('*', '*', 'chữ in nghiêng'),
    link: () => {
      const url = prompt('Nhập URL:');
      if (!url) return;
      insertAtCursor('[', `](${url})`, 'văn bản liên kết');
    },
    h1: () => insertLinePrefix('# '),
    h2: () => insertLinePrefix('## '),
    h3: () => insertLinePrefix('### '),
    bulletList: () => insertLinePrefix('- '),
    orderedList: () => insertLinePrefix('1. '),
    blockquote: () => insertLinePrefix('> '),
    code: () => insertBlock('```\n\n```'),
    hr: () => insertBlock('---'),
    checklist: () => insertLinePrefix('- [ ] '),
    table: () => insertBlock(
      '| Cột 1 | Cột 2 | Cột 3 |\n| --- | --- | --- |\n| Hàng 1 | Hàng 1 | Hàng 1 |\n| Hàng 2 | Hàng 2 | Hàng 2 |'
    ),
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          actions.bold();
          break;
        case 'i':
          e.preventDefault();
          actions.italic();
          break;
        case 'k':
          e.preventDefault();
          actions.link();
          break;
        case '/':
          e.preventDefault();
          setViewMode((m) => (m === 'preview' ? 'edit' : 'preview'));
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
      }
    }
  };

  const uploadFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" không phải ảnh`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" quá lớn (tối đa 10MB)`);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length === 0) return;

    const items: UploadItem[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      status: 'uploading',
      alt: file.name.replace(/\.[^/.]+$/, ''),
      caption: '',
    }));
    setUploads((prev) => [...prev, ...items]);

    for (const item of items) {
      try {
        const formData = new FormData();
        formData.append('file', item.file);
        const res = await fetch('/api/upload-cloudinary', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload thất bại');

        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: 'done', url: data.url } : u))
        );

        const md = `![${item.alt}](${data.url})`;
        insertAtCursor('', '', md);
        toast.success(`Đã chèn ảnh "${item.alt}"`);
      } catch (err) {
        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: 'error' } : u))
        );
        toast.error(err instanceof Error ? err.message : 'Upload lỗi');
      }
    }
  };

  const retryUpload = async (id: string) => {
    const item = uploads.find((u) => u.id === id);
    if (!item) return;
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'uploading' } : u))
    );
    try {
      const formData = new FormData();
      formData.append('file', item.file);
      const res = await fetch('/api/upload-cloudinary', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload thất bại');
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'done', url: data.url } : u))
      );
      const md = `![${item.alt}](${data.url})`;
      insertAtCursor('', '', md);
      toast.success('Đã tải lại ảnh');
    } catch {
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'error' } : u))
      );
      toast.error('Tải lại thất bại');
    }
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      uploadFiles(imageFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    pushUndo();
    onChange(e.target.value);
    updateCounts(e.target.value);
  };

  const ToolButton = ({
    icon: Icon,
    onClick,
    label,
    active = false,
    disabled = false,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    label: string;
    active?: boolean;
    disabled?: boolean;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded transition-colors',
            active
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground/70 hover:bg-muted hover:text-foreground',
            disabled && 'opacity-40 pointer-events-none'
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );

  const showEditor = viewMode === 'edit' || viewMode === 'split';
  const showPreview = viewMode === 'preview' || viewMode === 'split';

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-lg border bg-background',
          isFullscreen && 'fixed inset-0 z-50 rounded-none'
        )}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1.5">
          <ToolButton icon={Undo2} onClick={handleUndo} label="Hoàn tác (Ctrl+Z)" />
          <ToolButton icon={Redo2} onClick={handleRedo} label="Làm lại (Ctrl+Shift+Z)" />

          <div className="mx-1 h-5 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                title="Tiêu đề"
              >
                <Heading1 className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={actions.h1}>
                <Heading1 className="mr-2 h-4 w-4" /> Tiêu đề 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={actions.h2}>
                <Heading2 className="mr-2 h-4 w-4" /> Tiêu đề 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={actions.h3}>
                <Heading3 className="mr-2 h-4 w-4" /> Tiêu đề 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolButton icon={Bold} onClick={actions.bold} label="In đậm (Ctrl+B)" />
          <ToolButton icon={Italic} onClick={actions.italic} label="In nghiêng (Ctrl+I)" />
          <ToolButton icon={LinkIcon} onClick={actions.link} label="Chèn link (Ctrl+K)" />

          <div className="mx-1 h-5 w-px bg-border" />

          <ToolButton icon={List} onClick={actions.bulletList} label="Danh sách" />
          <ToolButton icon={ListOrdered} onClick={actions.orderedList} label="Danh sách số" />
          <ToolButton icon={CheckSquare} onClick={actions.checklist} label="Checklist" />
          <ToolButton icon={Quote} onClick={actions.blockquote} label="Trích dẫn" />
          <ToolButton icon={Code} onClick={actions.code} label="Code block" />
          <ToolButton icon={TableIcon} onClick={actions.table} label="Bảng" />
          <ToolButton icon={Minus} onClick={actions.hr} label="Đường kẻ" />

          <div className="mx-1 h-5 w-px bg-border" />

          <ToolButton icon={ImageIcon} onClick={handleFileSelect} label="Upload ảnh" />

          <div className="ml-auto flex items-center gap-0.5">
            <ToolButton
              icon={Pencil}
              onClick={() => setViewMode('edit')}
              label="Chỉ sửa"
              active={viewMode === 'edit'}
            />
            <ToolButton
              icon={Eye}
              onClick={() => setViewMode('preview')}
              label="Xem trước (Ctrl+/)"
              active={viewMode === 'preview'}
            />
            <ToolButton
              icon={Columns2}
              onClick={() => setViewMode('split')}
              label="Chia đôi"
              active={viewMode === 'split'}
            />
            <div className="mx-1 h-5 w-px bg-border" />
            <ToolButton
              icon={isFullscreen ? Minimize : Maximize}
              onClick={() => setIsFullscreen((v) => !v)}
              label={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            />
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        {uploads.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b bg-muted/20 p-2">
            {uploads.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-2 rounded-lg border bg-background px-2 py-1.5 text-xs"
              >
                {u.status === 'uploading' && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
                {u.status === 'done' && <ImageIcon className="h-3.5 w-3.5 text-success" />}
                {u.status === 'error' && <X className="h-3.5 w-3.5 text-destructive" />}
                <span className="max-w-[120px] truncate">{u.file.name}</span>
                {u.status === 'error' && (
                  <button
                    type="button"
                    onClick={() => retryUpload(u.id)}
                    className="text-primary hover:underline"
                  >
                    Thử lại
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeUpload(u.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            'flex flex-1 overflow-hidden',
            viewMode === 'split' && 'flex-row',
            isFullscreen ? 'min-h-[60vh]' : 'min-h-[300px]'
          )}
        >
          {showEditor && (
            <div
              className={cn(
                'relative flex flex-col',
                viewMode === 'split' ? 'w-1/2 border-r' : 'w-full'
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Viết nội dung Markdown ở đây... Hỗ trợ kéo thả ảnh, dán ảnh (Ctrl+V)"
                spellCheck={false}
                className={cn(
                  'flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed text-foreground/90 focus:outline-none',
                  dragOver && 'bg-primary/5'
                )}
                style={{ minHeight: isFullscreen ? '60vh' : '300px' }}
              />
              {dragOver && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center border-2 border-dashed border-primary bg-primary/5">
                  <div className="flex items-center gap-2 text-primary">
                    <Upload className="h-6 w-6" />
                    <span className="font-medium">Thả ảnh vào đây</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {showPreview && (
            <div className={cn('flex-1 overflow-auto bg-background p-4', viewMode === 'split' && 'w-1/2')}>
              {value.trim() ? (
                <MarkdownRenderer content={value} />
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có nội dung để xem trước</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{wordCount} từ</span>
            <span>{charCount} ký tự</span>
            {savedTime && <span className="text-success">Đã lưu nháp: {savedTime}</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Ctrl+B / I / K / Z · Ctrl+/ Preview</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
