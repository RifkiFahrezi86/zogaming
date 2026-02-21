'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { formatRupiah } from '@/lib/types';

interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'complete', label: 'Complete', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?status=${filter}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert('Gagal mengubah status');
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Hapus pesanan ini? Tindakan tidak bisa dibatalkan.')) return;
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch {
      alert('Gagal menghapus pesanan');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(search) ||
        o.customerEmail.toLowerCase().includes(search) ||
        o.customerPhone.includes(search) ||
        o.id.toString().includes(search)
      );
    }
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const completeCount = orders.filter(o => o.status === 'complete').length;
  const totalRevenue = orders.filter(o => o.status === 'complete').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pesanan</h1>
        <p className="text-slate-400">Kelola semua pesanan customer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-5">
          <p className="text-slate-400 text-sm">Total Pesanan</p>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>
        <div className="bg-[#1e293b] rounded-2xl border border-amber-500/30 p-5">
          <p className="text-amber-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-300">{pendingCount}</p>
        </div>
        <div className="bg-[#1e293b] rounded-2xl border border-blue-500/30 p-5">
          <p className="text-blue-400 text-sm">Processing</p>
          <p className="text-2xl font-bold text-blue-300">{processingCount}</p>
        </div>
        <div className="bg-[#1e293b] rounded-2xl border border-green-500/30 p-5">
          <p className="text-green-400 text-sm">Revenue (Complete)</p>
          <p className="text-2xl font-bold text-green-300">{formatRupiah(totalRevenue)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Cari nama, email, HP, atau ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[#1e293b] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-[#ee626b] focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'pending', label: 'Pending' },
            { key: 'processing', label: 'Processing' },
            { key: 'complete', label: 'Complete' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setFilter(tab.key); setLoading(true); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-[#ee626b] text-white'
                  : 'bg-[#1e293b] text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-[#1e293b] rounded-2xl p-12 text-center border border-slate-700/50">
          <svg className="animate-spin h-8 w-8 mx-auto text-[#ee626b]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          <p className="text-slate-400 mt-3">Memuat pesanan...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#1e293b] rounded-2xl p-12 text-center border border-slate-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="mx-auto mb-4"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <p className="text-slate-400">Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusOption = statusOptions.find(s => s.value === order.status) || statusOptions[0];
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Order Row */}
                <div className="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  <div className="flex-shrink-0">
                    {order.items[0]?.productImage ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden">
                        <Image src={order.items[0].productImage} alt="" width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-white">#{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusOption.color}`}>
                        {statusOption.label.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerPhone}</p>
                  </div>

                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-bold text-white">{formatRupiah(order.total)}</p>
                    <p className="text-xs text-slate-500">{order.items.length} item</p>
                  </div>

                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className={`transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-700/50 p-5">
                    {/* Customer Info */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Customer</p>
                        <p className="text-sm text-white font-medium">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-sm text-white">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">WhatsApp</p>
                        <a href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:underline flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          {order.customerPhone}
                        </a>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-5">
                      <p className="text-xs text-slate-500 mb-2">Produk</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={item.productImage} alt="" width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{item.productName}</p>
                              <p className="text-xs text-slate-500">x{item.quantity}</p>
                            </div>
                            <span className="text-sm text-white font-medium">{formatRupiah(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-5">
                        <p className="text-xs text-slate-500 mb-1">Catatan</p>
                        <p className="text-sm text-slate-300 bg-slate-800/50 rounded-xl p-3">{order.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white">{formatRupiah(order.total)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="h-9 px-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-[#ee626b]"
                        >
                          {statusOptions.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>

                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-3 bg-[#25D366] text-white rounded-xl flex items-center gap-1.5 text-sm font-medium hover:bg-[#1DA851] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Chat
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="h-9 px-3 bg-red-500/20 text-red-400 rounded-xl flex items-center gap-1.5 text-sm font-medium hover:bg-red-500/30 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
