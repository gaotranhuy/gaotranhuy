'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid } from './product-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Product, Category } from '@/types';
import { cn } from '@/lib/utils';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Mặc định' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
  { value: 'rating', label: 'Đánh giá cao' },
];

interface ProductFiltersProps {
  products: Product[];
  categories: Category[];
}

export function ProductFilters({ products, categories }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const initialCategory = searchParams.get('category') ?? 'all';

  const [query, setQuery] = React.useState(initialQuery);
  const [category, setCategory] = React.useState(
    initialCategory === 'all' ? 'all' : initialCategory
  );
  const [sort, setSort] = React.useState<SortKey>('default');
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const filtered = React.useMemo(() => {
    let result = [...products];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category !== 'all') {
      result = result.filter((p) => p.categorySlug === category);
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [products, query, category, sort]);

  return (
    <div>
      {/* Search + sort */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="pl-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            className="lg:hidden"
            onClick={() => setShowFilters((o) => !o)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Lọc
          </Button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar filters */}
        <aside
          className={cn(
            'lg:block',
            showFilters ? 'block' : 'hidden'
          )}
        >
          <div className="sticky top-24 space-y-4">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Danh mục
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setCategory('all')}
                    className={cn(
                      'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      category === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/80 hover:bg-accent'
                    )}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => setCategory(cat.slug)}
                      className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        category === cat.slug
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/80 hover:bg-accent'
                      )}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị <span className="font-semibold text-foreground">{filtered.length}</span> sản phẩm
            </p>
          </div>
          <ProductGrid products={filtered} columns={3} />
        </div>
      </div>
    </div>
  );
}
