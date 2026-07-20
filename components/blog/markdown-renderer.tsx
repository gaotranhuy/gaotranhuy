'use client';

import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

function extractText(children: React.ReactNode): string {
  let text = '';
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') text += child;
    else if (typeof child === 'number') text += String(child);
    else if (React.isValidElement(child)) {
      text += extractText((child.props as { children?: React.ReactNode }).children);
    }
  });
  return text;
}

function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

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
    <div className="code-block not-prose my-6">
      <div className="code-block__header">
        <span className="uppercase tracking-wide">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn('code-block__copy', copied && 'copied')}
          aria-label="Sao chép mã"
        >
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
  const memoized = React.useMemo(() => content ?? '', [content]);

  return (
    <div className={cn('prose prose-blog max-w-none dark:prose-invert', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          h1: ({ children, id }) => (
            <h1 id={id} className="article-h1">{children}</h1>
          ),
          h2: ({ children, id }) => (
            <h2 id={id} className="article-h2">{children}</h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="article-h3">{children}</h3>
          ),
          h4: ({ children, id }) => (
            <h4 id={id} className="article-h4">{children}</h4>
          ),
          h5: ({ children, id }) => (
            <h5 id={id} className="article-h5">{children}</h5>
          ),
          h6: ({ children, id }) => (
            <h6 id={id} className="article-h6">{children}</h6>
          ),
          p: ({ children }) => <p className="article-p">{children}</p>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link"
                >
                  {children}
                </a>
              );
            }
            return (
              <Link href={href ?? '#'} className="article-link">
                {children}
              </Link>
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children, className: ulClassName }) => {
            const isTaskList = ulClassName?.includes('contains-task-list');
            return (
              <ul className={cn('article-ul', isTaskList && 'article-task-list')}>
                {children}
              </ul>
            );
          },
          ol: ({ children }) => <ol className="article-ol">{children}</ol>,
          li: ({ children, className: liClassName }) => {
            const isTaskItem = liClassName?.includes('task-list-item');
            return (
              <li className={cn('article-li', isTaskItem && 'article-task-item')}>
                {children}
              </li>
            );
          },
          blockquote: ({ children }) => {
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0];
            let calloutType: string | null = null;
            let restChildren: React.ReactNode = children;

            if (React.isValidElement(firstChild)) {
              const props = firstChild.props as { children?: React.ReactNode };
              const firstText = extractText(props.children).trim();
              const match = firstText.match(CALLOUT_RE);
              if (match) {
                calloutType = match[1].toLowerCase();
                const remaining = firstText.replace(CALLOUT_RE, '').trim();
                const newFirst = React.cloneElement(
                  firstChild,
                  { children: remaining } as React.HTMLAttributes<HTMLParagraphElement>
                );
                restChildren = [newFirst, ...childArray.slice(1)];
              }
            }

            if (calloutType) {
              return (
                <div className={cn('callout', `callout-${calloutType}`)}>
                  {restChildren}
                </div>
              );
            }
            return <blockquote className="article-blockquote">{children}</blockquote>;
          },
          hr: () => <hr className="article-hr" />,
          img: ({ src, alt }) => {
            const srcStr = typeof src === 'string' ? src : '';
            const altStr = alt ?? '';
            if (!srcStr) return null;
            return <ImageZoom src={srcStr} alt={altStr} />;
          },
          table: ({ children }) => (
            <div className="article-table-wrap">
              <table className="article-table">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="article-thead">{children}</thead>,
          tbody: ({ children }) => <tbody className="article-tbody">{children}</tbody>,
          tr: ({ children }) => <tr className="article-tr">{children}</tr>,
          th: ({ children }) => <th className="article-th">{children}</th>,
          td: ({ children }) => <td className="article-td">{children}</td>,
          code: ({ className, children }) => {
            const isBlock = /language-/.test(className ?? '');
            if (isBlock) {
              const lang = className?.match(/language-(\w+)/)?.[1] || 'text';
              return <CodeBlock language={lang}>{children}</CodeBlock>;
            }
            return <code className="article-code-inline">{children}</code>;
          },
          pre: ({ children }) => <>{children}</>,
          input: ({ checked, type, className }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className={cn('article-checkbox', className)}
                />
              );
            }
            return <input type={type} className={className} />;
          },
          section: ({ children, className }) => (
            <section className={cn('article-footnotes-section', className)}>
              {children}
            </section>
          ),
        }}
      >
        {memoized}
      </ReactMarkdown>
    </div>
  );
}
