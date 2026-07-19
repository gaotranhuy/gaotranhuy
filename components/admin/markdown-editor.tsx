'use client';

import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  tablePlugin,
  markdownShortcutPlugin,
  frontmatterPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertTable,
  ListsToggle,
  InsertThematicBreak,
  UndoRedo,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  codeBlockPlugin,
  linkDialogPlugin,
  imagePlugin,
  KitchenSinkToolbar,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useCallback, useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

function ImageUploadButton({ onInsert }: { onInsert: (url: string, alt: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
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
    const toastId = 'md-upload';
    toast.loading(`Đang tải ${validFiles.length} ảnh lên Cloudinary...`, { id: toastId });

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload-cloudinary', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Tải ảnh "${file.name}" thất bại`);
        return { url: data.url as string, alt: file.name.replace(/\.[^.]+$/, '') };
      });

      const uploaded = await Promise.all(uploadPromises);
      uploaded.forEach((item) => onInsert(item.url, item.alt));
      toast.success('Tải ảnh thành công', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Lỗi kết nối khi tải ảnh', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
        className="hidden"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={(e) => {
          e.preventDefault();
          if (!uploading) inputRef.current?.click();
        }}
        className="mdxeditor-toolbar-button inline-flex h-6 w-6 items-center justify-center rounded text-foreground/70 hover:bg-accent hover:text-foreground disabled:opacity-50"
        title="Tải ảnh lên Cloudinary"
      >
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
      </button>
    </>
  );
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  const insertImageAtCursor = useCallback((url: string, alt: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.insertMarkdown(`\n![${alt}](${url})\n`);
  }, []);

  return (
    <div className="markdown-editor-wrapper rounded-lg border border-input bg-background overflow-hidden">
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={onChange}
        contentEditableClassName="prose prose-sm max-w-none min-h-[300px] prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground prose-blockquote:border-l-primary prose-code:before:hidden prose-code:after:hidden prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground prose-img:rounded-lg prose-table:text-sm prose-th:bg-muted"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'ts' }),
          markdownShortcutPlugin(),
          frontmatterPlugin(),
          diffSourcePlugin({ diffMarkdown: value, viewMode: 'rich-text' }),
          imagePlugin({
            imageUploadHandler: async () => {
              return Promise.reject(new Error('Sử dụng nút Upload ảnh'));
            },
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <KitchenSinkToolbar>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
                  <CreateLink />
                  <InsertTable />
                  <InsertThematicBreak />
                  <InsertCodeBlock />
                  <InsertFrontmatter />
                  <ImageUploadButton onInsert={insertImageAtCursor} />
                </KitchenSinkToolbar>
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    </div>
  );
}
