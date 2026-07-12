'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Plus, Search, Pencil, Trash2, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/image-upload';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { toast } from 'sonner';
import { formatDateLong } from '@/lib/format';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  published_at: string;
  reading_time: number;
  tags: string[];
  created_at: string;
}

const PER_PAGE = 10;

const emptyForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: '',
  image: '',
  author: 'Gạo Trần Huy',
  published_at: new Date().toISOString().split('T')[0],
  reading_time: '5',
  tags: '',
};

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        toast.error('Không thể tải danh sách bài viết');
      }
    } catch {
      toast.error('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filtered = posts.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

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

  const openEdit = (p: BlogPost) => {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || '',
      content: p.content || '',
      category: p.category || '',
      image: p.image || '',
      author: p.author || 'Gạo Trần Huy',
      published_at: p.published_at || new Date().toISOString().split('T')[0],
      reading_time: String(p.reading_time || 5),
      tags: (p.tags || []).join(', '),
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      toast.error('Vui lòng nhập tiêu đề và slug');
      return;
    }

    setSaving(true);
    const toastId = 'save-post';
    toast.loading('Đang đồng bộ...', { id: toastId });

    const payload = {
      ...form,
      reading_time: parseInt(form.reading_time, 10) || 5,
      tags: form.tags
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog';
      const method = editingId ? 'PUT' : 'POST';

      const optimisticPost: BlogPost = {
        id: editingId || 'temp',
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        image: form.image,
        author: form.author,
        published_at: form.published_at,
        reading_time: payload.reading_time,
        tags: payload.tags,
        created_at: new Date().toISOString(),
      };

      startTransition(() => {
        if (editingId) {
          setPosts((prev) =>
            prev.map((p) => (p.id === editingId ? { ...p, ...optimisticPost, id: editingId } : p))
          );
        } else {
          setPosts((prev) => [{ ...optimisticPost, id: 'temp-' + Date.now() }, ...prev]);
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
        await fetchPosts();
        return;
      }

      toast.success(editingId ? 'Cập nhật thành công' : 'Thêm bài viết thành công', {
        id: toastId,
      });
      setDialogOpen(false);
      await fetchPosts();
    } catch {
      toast.error('Lỗi kết nối', { id: toastId });
      await fetchPosts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;

    setDeletingId(id);
    const toastId = 'delete-post';
    toast.loading('Đang xóa...', { id: toastId });

    const prevPosts = posts;
    startTransition(() => {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    });

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Xóa thất bại', { id: toastId });
        setPosts(prevPosts);
        return;
      }

      toast.success('Đã xóa bài viết', { id: toastId });
    } catch {
      toast.error('Lỗi kết nối', { id: toastId });
      setPosts(prevPosts);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Blog</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} bài viết
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm bài viết
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Ảnh</th>
              <th className="px-4 py-3 text-left font-semibold">Tiêu đề</th>
              <th className="px-4 py-3 text-left font-semibold">Danh mục</th>
              <th className="px-4 py-3 text-left font-semibold">Ngày đăng</th>
              <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  Không có bài viết
                </td>
              </tr>
            ) : (
              pageItems.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <div className="line-clamp-1 max-w-xs">{p.title}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.published_at ? formatDateLong(p.published_at) : '-'}
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
                        onClick={() => handleDelete(p.id, p.title)}
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
              ))
            )}
          </tbody>
        </table>
      </div>

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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Sửa bài viết' : 'Thêm bài viết mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tiêu đề *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  placeholder="cach-nau-com-ngon"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Mẹo vặt"
                />
              </div>
              <div className="space-y-2">
                <Label>Tác giả</Label>
                <Input
                  value={form.author}
                  onChange={(e) =>
                    setForm({ ...form, author: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Thời gian đọc (phút)</Label>
                <Input
                  type="number"
                  value={form.reading_time}
                  onChange={(e) =>
                    setForm({ ...form, reading_time: e.target.value })
                  }
                  min="1"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ngày đăng</Label>
                <Input
                  type="date"
                  value={form.published_at}
                  onChange={(e) =>
                    setForm({ ...form, published_at: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (cách nhau bởi dấu phẩy)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="gạo, mẹo vặt"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mô tả ngắn</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm({ ...form, excerpt: e.target.value })
                }
                rows={2}
              />
            </div>

            {/* ĐOẠN CODE MỚI ĐÃ SỬA LỖI ĐỊNH KIỂU */}
<ImageUpload
  value={form.image}
  onChange={(url) => setForm({ ...form, image: url as string })} // <--- Thêm chữ "as string" ở đây ní nhé
  label="Ảnh bìa"
/>


            <div className="space-y-2">
              <Label>Nội dung</Label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />
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
                  'Thêm bài viết'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
