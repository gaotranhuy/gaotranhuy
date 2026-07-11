'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  X,
  RefreshCw,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/admin/image-upload';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';

interface Product {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  short_description: string;
  description: string;
  origin: string;
  weight: string;
  price: number;
  old_price: number | null;
  unit: string;
  image: string;
  gallery: string[];
  features: string[];
  nutrition_facts: { label: string; value: string }[];
  tags: string[];
  rating: number;
  review_count: number;
  sold_count: number;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  created_at: string;
  shopeeUrl: string;
}

const CATEGORIES = [
  { slug: 'gao-binh-dan', name: 'Gạo Bình Dân' },
  { slug: 'gao-dac-san', name: 'Gạo Đặc Sản' },
  { slug: 'gao-nep-gao-lut', name: 'Gạo Nếp - Gạo Lứt' },
  { slug: 'gao-pho-thong', name: 'Gạo Phổ Thông' },
  { slug: 'nuoc-mam-dau-lac', name: 'Nước Mắm & Dầu Lạc' },
  { slug: 'san-pham-khac', name: 'Sản Phẩm Khác' },
] as const;

const PER_PAGE = 10;

const emptyForm = {
  slug: '',
  name: '',
  category_slug: 'gao-binh-dan',
  short_description: '',
  description: '',
  origin: '',
  weight: '',
  price: '',
  old_price: '',
  unit: '',
  image: '',
  gallery: [] as string[],
  features: '',
  tags: '',
  in_stock: true,
  is_featured: false,
  is_best_seller: false,
  is_new: false,
  shopeeUrl: '',
};

function TableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Ảnh</th>
            <th className="px-4 py-3 text-left font-semibold">Tên</th>
            <th className="px-4 py-3 text-left font-semibold">Danh mục</th>
            <th className="px-4 py-3 text-right font-semibold">Giá</th>
            <th className="px-4 py-3 text-center font-semibold">Tồn</th>
            <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
              <td className="px-4 py-3"><Skeleton className="h-10 w-10 rounded" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
              <td className="px-4 py-3"><Skeleton className="ml-auto h-4 w-16" /></td>
              <td className="px-4 py-3 text-center"><Skeleton className="mx-auto h-2 w-2 rounded-full" /></td>
              <td className="px-4 py-3"><Skeleton className="ml-auto h-8 w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-xl border bg-card p-3">
          <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [, startTransition] = useTransition();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      } else {
        toast.error('Không thể tải danh sách sản phẩm');
      }
    } catch {
      toast.error('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === 'all' || p.category_slug === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      name: p.name,
      category_slug: p.category_slug,
      short_description: p.short_description || '',
      description: p.description || '',
      origin: p.origin || '',
      weight: p.weight || '',
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : '',
      unit: p.unit || '',
      image: p.image || '',
      gallery: p.gallery || [],
      features: (p.features || []).join(', '),
      tags: (p.tags || []).join(', '),
      in_stock: p.in_stock,
      is_featured: p.is_featured,
      is_best_seller: p.is_best_seller,
      is_new: p.is_new,
      shopeeUrl: p.shopeeUrl || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error('Vui lòng nhập tên và slug');
      return;
    }

    setSaving(true);
    const toastId = 'save-product';
    toast.loading('Đang đồng bộ...', { id: toastId });

    const payload = {
      ...form,
      price: form.price.replace(/\D/g, ''),
      old_price: form.old_price ? form.old_price.replace(/\D/g, '') : '',
      features: form.features
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : '/api/admin/products';
      const method = editingId ? 'PUT' : 'POST';

      const optimisticProduct: Product = {
        id: editingId || 'temp',
        slug: form.slug,
        name: form.name,
        category_slug: form.category_slug,
        short_description: form.short_description,
        description: form.description,
        origin: form.origin,
        weight: form.weight,
        price: parseInt(form.price.replace(/\D/g, ''), 10) || 0,
        old_price: form.old_price
          ? parseInt(form.old_price.replace(/\D/g, ''), 10)
          : null,
        unit: form.unit,
        image: form.image,
        gallery: form.gallery,
        features: payload.features,
        nutrition_facts: [],
        tags: payload.tags,
        rating: 0,
        review_count: 0,
        sold_count: 0,
        in_stock: form.in_stock,
        is_featured: form.is_featured,
        is_best_seller: form.is_best_seller,
        is_new: form.is_new,
        created_at: new Date().toISOString(),
        shopeeUrl: form.shopeeUrl,
      };

      startTransition(() => {
        if (editingId) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingId
                ? { ...p, ...optimisticProduct, id: editingId }
                : p
            )
          );
        } else {
          setProducts((prev) => [
            { ...optimisticProduct, id: 'temp-' + Date.now() },
            ...prev,
          ]);
        }
      });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Thất bại', { id: toastId });
        await fetchProducts();
        return;
      }

      toast.success(
        editingId ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công',
        { id: toastId }
      );
      setDialogOpen(false);
      await fetchProducts();
    } catch {
      toast.error('Lỗi kết nối', { id: toastId });
      await fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return;

    setDeletingId(id);
    const toastId = 'delete-product';
    toast.loading('Đang xóa...', { id: toastId });

    const prevProducts = products;
    startTransition(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    });

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Xóa thất bại', { id: toastId });
        setProducts(prevProducts);
        return;
      }

      toast.success('Đã xóa sản phẩm', { id: toastId });
    } catch {
      toast.error('Lỗi kết nối', { id: toastId });
      setProducts(prevProducts);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSyncSheet = async () => {
    setSyncing(true);
    const toastId = 'sync-sheet';
    toast.loading('Đang đồng bộ từ Google Sheet...', { id: toastId });

    try {
      const res = await fetch('/api/admin/sync-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Đồng bộ thất bại', { id: toastId });
        return;
      }

      toast.success(
        `Đồng bộ thành công: ${data.products} sản phẩm, ${data.blog} bài viết`,
        { id: toastId }
      );
      await fetchProducts();
    } catch {
      toast.error('Lỗi kết nối', { id: toastId });
    } finally {
      setSyncing(false);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (url && !form.gallery.includes(url)) {
      setForm((prev) => ({ ...prev, gallery: [...prev.gallery, url] }));
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const categoryName = (slug: string) =>
    CATEGORIES.find((c) => c.slug === slug)?.name || slug;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Quản lý sản phẩm</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} sản phẩm
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleSyncSheet}
            disabled={syncing}
            className="gap-2"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Đồng bộ Google Sheet</span>
            <span className="sm:hidden">Sheet</span>
          </Button>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm sản phẩm</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content: table on desktop, cards on mobile */}
      {loading ? (
        <>
          <div className="hidden sm:block">
            <TableSkeleton />
          </div>
          <div className="sm:hidden">
            <CardSkeleton />
          </div>
        </>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card py-16 text-center">
          <Package className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Không có sản phẩm</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border bg-card sm:block">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Ảnh</th>
                  <th className="px-4 py-3 text-left font-semibold">Tên</th>
                  <th className="px-4 py-3 text-left font-semibold">Danh mục</th>
                  <th className="px-4 py-3 text-right font-semibold">Giá</th>
                  <th className="px-4 py-3 text-center font-semibold">Tồn</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {categoryName(p.category_slug)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(p.price)}
                      {p.old_price && (
                        <span className="ml-1 text-xs text-muted-foreground line-through">
                          {formatPrice(p.old_price)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                          p.in_stock ? 'bg-success' : 'bg-destructive'
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(p)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 sm:hidden">
            {pageItems.map((p) => (
              <div
                key={p.id}
                className="flex gap-3 rounded-xl border bg-card p-3"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{p.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {p.id}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {categoryName(p.category_slug)}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {formatPrice(p.price)}
                      {p.old_price && (
                        <span className="ml-1 text-xs text-muted-foreground line-through">
                          {formatPrice(p.old_price)}
                        </span>
                      )}
                    </span>
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${
                        p.in_stock ? 'bg-success' : 'bg-destructive'
                      }`}
                    />
                  </div>
                  <div className="flex gap-1 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(p)}
                      className="h-8 gap-1.5"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deletingId === p.id}
                      className="h-8 gap-1.5 text-destructive hover:text-destructive"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tên sản phẩm *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select
                  value={form.category_slug}
                  onValueChange={(v) =>
                    setForm({ ...form, category_slug: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Đơn vị</Label>
                <Input
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Giá (VND) *</Label>
                <Input
                  type="text"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value.replace(/[^\d]/g, ''),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Giá cũ</Label>
                <Input
                  type="text"
                  value={form.old_price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      old_price: e.target.value.replace(/[^\d]/g, ''),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Trọng lượng</Label>
                <Input
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
            </div>



<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn sản phẩm Shopee (shopeeUrl)</label>
  <Input
    placeholder="Nhập link sản phẩm trên sàn Shopee..."
    value={form.shopeeUrl}
    onChange={(e) => setForm({ ...form, shopeeUrl: e.target.value })}
  />
</div>

            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nguồn gốc</Label>
                <Input
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (cách nhau bởi dấu phẩy)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mô tả ngắn</Label>
              <Textarea
                value={form.short_description}
                onChange={(e) =>
                  setForm({ ...form, short_description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Mô tả đầy đủ</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Đặc điểm (mỗi dòng một đặc điểm)</Label>
              <Textarea
                value={form.features}
                onChange={(e) =>
                  setForm({ ...form, features: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-foreground">
                Ảnh đại diện chính
              </Label>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
              <div>
                <Label className="font-semibold text-foreground">
                  Album ảnh chi tiết (Gallery)
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Tải lên các ảnh chi tiết hiển thị trong trang sản phẩm
                </p>
              </div>

              {form.gallery && form.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {form.gallery.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square w-full overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${idx}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1 text-white opacity-90 shadow-sm transition-opacity hover:bg-destructive group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2">
                <ImageUpload
                  value=""
                  onChange={(url) => handleAddGalleryImage(url)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) =>
                    setForm({ ...form, in_stock: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Còn hàng
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm({ ...form, is_featured: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Nổi bật
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_best_seller}
                  onChange={(e) =>
                    setForm({ ...form, is_best_seller: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Bán chạy
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_new}
                  onChange={(e) =>
                    setForm({ ...form, is_new: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Mới
              </label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : editingId ? (
                  'Lưu thay đổi'
                ) : (
                  'Thêm sản phẩm'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
