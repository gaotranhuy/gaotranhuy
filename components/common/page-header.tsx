import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b bg-gradient-to-b from-accent/40 to-background',
        className
      )}
    >
      <div className="grain-bg absolute inset-0 opacity-50" />
      <div className="container-page relative py-12 sm:py-16">
        <div className="flex flex-col items-center text-center">
          {eyebrow && (
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
