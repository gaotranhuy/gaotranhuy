'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Check, Copy } from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split('\n');
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[#*`_~]/g, '').trim();
      const id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export function MarkdownContent({ content }: { content: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('[data-copy-btn]') as HTMLButtonElement | null;
      if (!btn) return;
      e.preventDefault();
      const codeEl = btn.closest('pre')?.querySelector('code');
      if (codeEl) {
        const text = codeEl.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
          const id = btn.dataset.id || '';
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        });
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-foreground prose-h1:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-relaxed prose-p:text-foreground/85 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:bg-muted/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:not-italic prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-img:mx-auto prose-img:rounded-xl prose-img:shadow-sm prose-table:overflow-hidden prose-table:rounded-lg prose-table:border prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-hr:border-border prose-code:before:hidden prose-code:after:hidden prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground prose-pre:rounded-lg prose-pre:bg-[#0d1117] prose-pre:p-4 prose-pre:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: 'heading-anchor' } }],
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={{
          img: ({ src, alt, ...props }) => (
            <span className="block my-6">
              <img
                src={typeof src === 'string' ? src : undefined}
                alt={alt || ''}
                loading="lazy"
                className="mx-auto rounded-xl shadow-sm"
                {...props}
              />
              {alt && (
                <span className="mt-2 block text-center text-sm text-muted-foreground italic">
                  {alt}
                </span>
              )}
            </span>
          ),
          pre: ({ children, ...props }) => {
            const id = `code-${Math.random().toString(36).slice(2, 9)}`;
            return (
              <div className="group relative my-4">
                <button
                  type="button"
                  data-copy-btn
                  data-id={id}
                  className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md bg-background/80 text-foreground/70 opacity-0 shadow transition group-hover:opacity-100 hover:bg-background hover:text-foreground"
                  title="Sao chép mã"
                >
                  {copiedId === id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <pre id={id} {...props}>
                  {children}
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function buildToc(markdown: string): HeadingItem[] {
  return extractHeadings(markdown);
}

export function TableOfContents({ items }: { items: HeadingItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="toc-list space-y-1 text-sm" aria-label="Mục lục">
      {items.map((item, i) => (
        <a
          key={`${item.id}-${i}`}
          href={`#${item.id}`}
          className="block text-muted-foreground transition-colors hover:text-primary"
          style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
