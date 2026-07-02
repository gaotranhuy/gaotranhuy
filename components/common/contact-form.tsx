'use client';

import * as React from 'react';
import { Send, Check, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactInfo } from '@/data/site';

export function ContactForm() {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;

    const text = `Liên hệ từ ${form.name}\nSĐT: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(
      `https://zalo.me/${contactInfo.zalo}?message=${encodeURIComponent(text)}`,
      '_blank'
    );
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="font-display text-xl font-bold">Gửi tin nhắn cho chúng tôi</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Điền form dưới đây, chúng tôi sẽ liên hệ với bạn qua Zalo.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Họ tên <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Số điện thoại <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0901 234 567"
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="pl-10"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">
            Nội dung <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Nội dung bạn muốn liên hệ..."
              className="pl-10"
              rows={4}
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full">
          {sent ? (
            <>
              <Check className="h-4 w-4" />
              Đã gửi thành công
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Gửi tin nhắn
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
