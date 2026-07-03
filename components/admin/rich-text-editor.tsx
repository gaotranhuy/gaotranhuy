'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
      Placeholder.configure({
        placeholder: 'Viết nội dung bài viết ở đây...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground',
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[200px] rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Đang tải trình soạn thảo...</p>
      </div>
    );
  }

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
      label: 'In đậm',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
      label: 'In nghiêng',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 }),
      label: 'Tiêu đề',
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
      label: 'Danh sách',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
      label: 'Danh sách số',
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive('blockquote'),
      label: 'Trích dẫn',
    },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      active: false,
      label: 'Hoàn tác',
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      active: false,
      label: 'Làm lại',
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex flex-wrap gap-1 border-b bg-muted/50 p-2">
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            title={btn.label}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded transition-colors',
              btn.active
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground/70'
            )}
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
