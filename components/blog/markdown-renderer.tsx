'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import type { Pluggable } from 'unified';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageZoom } from './image-zoom';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const CALLOUT_RE = /^\[!(info|warning|success|error|note)\]/i;

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);
  const language = className?.replace(/^language-/, '') || 'text';

  const handleCopy = async () => {
    const text = ref.current?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="code-block not-prose my-5">
      <div className="code-block__header">
        <span className="uppercase tracking-wide">{language}</span>
        <button type="button" onClick={handleCopy} className={cn('code-block__copy', copied && 'copied')} aria-label="Sao chép mã">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Đã chép' : 'Sao chép'}
        </button>
      </div>
      <pre ref={ref} className="!mt-0 !rounded-t-none">
        {children}
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none sm:prose-base', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFootnotes as unknown as Pluggable]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="font-display text-3xl font-extrabold tracking-tight">{children}</h1>,
          h2: ({ children, id }) => <h2 id={id} className="font-display text-2xl font-bold tracking-tight mt-10 mb-4">{children}</h2>,
          h3: ({ children, id }) => <h3 id={id} className="font-display text-xl font-bold mt-6 mb-3">{children}</h3>,
          h4: ({ children, id }) => <h4 id={id} className="font-display text-lg font-semibold mt-5 mb-2">{children}</h4>,
          h5: ({ children, id }) => <h5 id={id} className="font-semibold mt-4 mb-2">{children}</h5>,
          h6: ({ children, id }) => <h6 id={id} className="font-semibold text-sm mt-3 mb-1 text-muted-foreground">{children}</h6>,
          p: ({ children }) => <p className="leading-relaxed text-foreground/85">{children}</p>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            if (isExternal) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  {children}
                </a>
              );
            }
            return <Link href={href ?? '#'} className="text-primary underline underline-offset-2 hover:text-primary/80">{children}</Link>;
          },
          ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-6 marker:text-primary/60">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-6 marker:text-primary/60">{children}</ol>,
          li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
          blockquote: ({ children }) => {
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0];
            let calloutType: string | null = null;
            let restChildren = children;

            if (React.isValidElement(firstChild)) {
              const props = firstChild.props as { children?: React.ReactNode };
              if (typeof props.children === 'string') {
                const match = props.children.trim().match(CALLOUT_RE);
                if (match) {
                  calloutType = match[1].toLowerCase();
                  const remaining = (props.children as string).replace(CALLOUT_RE, '').trim();
                  restChildren = [
                    React.cloneElement(firstChild, { children: remaining } as React.HTMLAttributes<HTMLParagraphElement>),
                    ...childArray.slice(1),
                  ];
                }
              }
            }

            if (calloutType) {
              return <div className={cn('callout', `callout-${calloutType}`)}>{restChildren}</div>;
            }
            return <blockquote className="border-l-4 border-primary/40 pl-4 italic text-foreground/80 my-4">{children}</blockquote>;
          },
          hr: () => <hr className="my-8 border-border" />,
          img: ({ src, alt }) => {
            const srcStr = typeof src === 'string' ? src : '';
            const altStr = alt ?? '';
            if (!srcStr) return null;
            return <ImageZoom src={srcStr} alt={altStr} />;
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
          th: ({ children }) => <th className="border-b border-border px-4 py-2.5 text-left font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-b border-border px-4 py-2.5">{children}</td>,
          code: ({ className, children }) => {
            const isBlock = className?.startsWith('language-');
            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }
            return <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-semibold">{children}</code>;
          },
          pre: ({ children }) => <>{children}</>,
          input: ({ checked, ...props }) => (
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="mr-2 h-4 w-4 rounded border-border accent-primary"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
