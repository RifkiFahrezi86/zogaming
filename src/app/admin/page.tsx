'use client';

import Link from 'next/link';
import { useData } from '@/lib/DataContext';
import { formatRupiah } from '@/lib/types';

export default function AdminDashboard() {
    const { products, categories, orders, badges } = useData();

    const totalRevenue = orders
        .filter((o) => o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const recentOrders = orders.slice(0, 5);

    const stats = [
        {
            label: 'Total Products',
            value: products.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            href: '/admin/products',
        },
        {
            label: 'Categories',
            value: categories.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            href: '/admin/categories',
        },
        {
            label: 'Total Orders',
            value: orders.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            href: '/admin/orders',
        },
        {
            label: 'Revenue',
            value: formatRupiah(totalRevenue),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            color: 'from-amber-500 to-amber-600',
            href: '/admin/orders',
        },
        {
            label: 'Active Badges',
            value: badges.filter(b => b.active).length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            ),
            color: 'from-pink-500 to-pink-600',
            href: '/admin/badges',
        },
        {
            label: 'Trending',
            value: products.filter(p => p.trending).length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </svg>
            ),
            color: 'from-cyan-500 to-cyan-600',
            href: '/admin/products',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'status-pending';
            case 'processing':
                return 'status-processing';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400">Welcome back! Here is what is happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/products"
                        className="px-4 py-2 bg-[#010101] text-white rounded-xl font-medium hover:bg-[#000000] transition-colors"
                    >
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <div className="admin-card p-6 hover:border-[#010101]/50 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 admin-card overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                        <Link
                            href="/admin/orders"
                            className="text-sm text-white hover:text-slate-300 transition-colors"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-left">Order ID</th>
                                    <th className="px-6 py-4 text-left">Customer</th>
                                    <th className="px-6 py-4 text-left">Total</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{order.id}</td>
                                        <td className="px-6 py-4 text-slate-300">{order.customer.name}</td>
                                        <td className="px-6 py-4 text-white font-semibold">{formatRupiah(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Add New Product</p>
                                <p className="text-slate-400 text-sm">Create a new game listing</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/categories"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Manage Categories</p>
                                <p className="text-slate-400 text-sm">Edit game categories</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">View Orders</p>
                                <p className="text-slate-400 text-sm">{pendingOrders} pending orders</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/badges"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Manage Badges</p>
                                <p className="text-slate-400 text-sm">{badges.filter(b => b.active).length} active badges</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-medium">Site Settings</p>
                                <p className="text-slate-400 text-sm">Configure your store</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
