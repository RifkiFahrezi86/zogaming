'use client';

import { useState } from 'react';
import { useData } from '@/lib/DataContext';
import { Order, formatRupiah } from '@/lib/types';

export default function AdminOrdersPage() {
    const { orders, updateOrderStatus } = useData();
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'processing': return 'status-processing';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <p className="text-slate-400">Manage customer orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card p-4 flex flex-wrap gap-2">
                {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors capitalize ${filterStatus === status
                                ? 'bg-[#010101] text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {status === 'all' ? 'All Orders' : status}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full admin-table">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 text-left">Order ID</th>
                                <th className="px-6 py-4 text-left">Customer</th>
                                <th className="px-6 py-4 text-left">Products</th>
                                <th className="px-6 py-4 text-left">Total</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white">{order.customer.name}</p>
                                            <p className="text-slate-400 text-sm">{order.customer.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {order.products.length} item(s)
                                    </td>
                                    <td className="px-6 py-4 text-white font-semibold">{formatRupiah(order.total)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 text-sm">
                                        {formatDate(order.date)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                                title="View Details"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-slate-400">No orders found.</p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg">
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Order {selectedOrder.id}</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Customer</h3>
                                <p className="text-white">{selectedOrder.customer.name}</p>
                                <p className="text-slate-400">{selectedOrder.customer.email}</p>
                            </div>

                            {/* Products */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Products</h3>
                                <div className="space-y-2">
                                    {selectedOrder.products.map((product, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                                            <div>
                                                <p className="text-white">{product.name}</p>
                                                <p className="text-slate-400 text-sm">Qty: {product.quantity}</p>
                                            </div>
                                            <p className="text-white font-semibold">{formatRupiah(product.price * product.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                                    <p className="text-lg font-semibold text-white">Total</p>
                                    <p className="text-xl font-bold text-[#010101]">{formatRupiah(selectedOrder.total)}</p>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                updateOrderStatus(selectedOrder.id, status as Order['status']);
                                                setSelectedOrder({ ...selectedOrder, status: status as Order['status'] });
                                            }}
                                            className={`px-4 py-2 rounded-xl font-medium transition-colors capitalize ${selectedOrder.status === status
                                                    ? 'bg-[#010101] text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
