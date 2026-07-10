'use client';

import * as React from 'react';
import { ShoppingBag, Calendar, MapPin, Phone, User, FileText, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface HistoryOrder {
  id: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingFee: number;
  grandTotal: number;
}

export function OrderHistory() {
  const [orders, setOrders] = React.useState<HistoryOrder[]>([]);

  React.useEffect(() => {
    // Lấy dữ liệu đơn hàng đã lưu từ localStorage khi component mount
    const savedOrders = localStorage.getItem('gth_order_history');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Lỗi đọc lịch sử đơn hàng:', e);
      }
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium">Bạn chưa có lịch sử đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-600" />
        Đơn hàng đã đặt gần đây
      </h2>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            {/* Header đơn hàng */}
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-700">Mã đơn: #{order.id}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {order.date}
                </p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                Đã gửi qua hệ thống
              </span>
            </div>

            {/* Thông tin khách hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
              <div className="space-y-1.5">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-800">{order.customer.name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{order.customer.phone}</span>
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{order.customer.address}</span>
                </p>
                {order.customer.note && (
                  <p className="text-xs italic text-gray-500 pl-6">Lưu ý: {order.customer.note}</p>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm trong đơn */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chi tiết sản phẩm</p>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 text-sm">
                    <p className="text-gray-700 font-medium">
                      {item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span>
                    </p>
                    <p className="text-gray-900 font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tính toán tổng tiền */}
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1"><Truck className="h-4 w-4" /> Phí vận chuyển</span>
                <span>{order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold text-gray-900 pt-1">
                <span>Tổng tiền hóa đơn</span>
                <span className="text-emerald-600">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
