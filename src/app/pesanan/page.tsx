'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatRupiah } from '@/lib/types';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  productPrice: number;
  quantity: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  accountEmail: string | null;
  accountPassword: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: string; bg: string }> = {
  PENDING: { label: 'Menunggu Pembayaran', color: 'text-yellow-400', icon: '⏳', bg: 'bg-yellow-500/20 border-yellow-500/30' },
  PROCESSING: { label: 'Sedang Diproses', color: 'text-blue-400', icon: '🔄', bg: 'bg-blue-500/20 border-blue-500/30' },
  COMPLETED: { label: 'Selesai', color: 'text-green-400', icon: '✅', bg: 'bg-green-500/20 border-green-500/30' },
  CANCELLED: { label: 'Dibatalkan', color: 'text-red-400', icon: '❌', bg: 'bg-red-500/20 border-red-500/30' },
};

export default function PesananPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Check if logged in
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        // Load customer orders
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
    // Auto refresh every 15 seconds
    const interval = setInterval(loadOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/page-heading-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        <div className="relative z-10 container mx-auto px-4 py-16 pt-32">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">📦 Pesanan Saya</h1>
            <p className="text-gray-300">Lihat status dan detail semua pesanan kamu</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#ee626b] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !isLoggedIn ? (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">Login Diperlukan</h3>
                <p className="text-gray-400 mb-6">Silakan login untuk melihat pesanan kamu</p>
                <Link
                  href="/auth/login"
                  className="inline-block px-8 py-3 bg-[#ee626b] text-white font-semibold rounded-full hover:bg-[#d4555d] transition-colors"
                >
                  Login Sekarang
                </Link>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-white mb-2">Belum Ada Pesanan</h3>
                <p className="text-gray-400 mb-6">Kamu belum punya pesanan. Yuk belanja!</p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 bg-[#ee626b] text-white font-semibold rounded-full hover:bg-[#d4555d] transition-colors"
                >
                  Mulai Belanja
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Orders List */}
              <div className="lg:col-span-3 space-y-3">
                {orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.PENDING;
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white/10 backdrop-blur-md rounded-2xl border cursor-pointer transition-all hover:border-[#ee626b]/50 p-5 ${
                        isSelected ? 'border-[#ee626b]' : 'border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-white text-lg">{order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{order.productName}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'long', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <span className="text-[#ee626b] font-bold text-lg">{formatRupiah(order.total)}</span>
                      </div>
                      {order.paymentMethod && (
                        <div className="mt-2 text-xs text-gray-400">
                          Metode: <span className="text-gray-300 uppercase">{order.paymentMethod}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order Detail Panel */}
              <div className="lg:col-span-2">
                {selectedOrder ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sticky top-28">
                    <h3 className="font-bold text-white text-xl mb-1">{selectedOrder.orderNumber}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-5 ${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.color}`}>
                      {statusConfig[selectedOrder.status]?.icon} {statusConfig[selectedOrder.status]?.label}
                    </span>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Produk</span>
                        <span className="text-white font-semibold">{selectedOrder.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Jumlah</span>
                        <span className="text-white">{selectedOrder.quantity}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total</span>
                        <span className="text-[#ee626b] font-bold">{formatRupiah(selectedOrder.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pembayaran</span>
                        <span className="text-white uppercase">{selectedOrder.paymentMethod || 'Belum dipilih'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tanggal</span>
                        <span className="text-white text-xs">
                          {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Pending: Show payment link */}
                    {selectedOrder.status === 'PENDING' && (
                      <div className="mt-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm font-semibold mb-2">⏳ Menunggu Pembayaran</p>
                        <p className="text-yellow-300/70 text-xs mb-3">Segera lakukan pembayaran sebelum expired</p>
                        <Link
                          href={`/payment/${selectedOrder.id}`}
                          className="block text-center py-2.5 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-sm"
                        >
                          Bayar Sekarang
                        </Link>
                      </div>
                    )}

                    {/* Processing */}
                    {selectedOrder.status === 'PROCESSING' && (
                      <div className="mt-5 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <p className="text-blue-400 text-sm font-semibold">🔄 Sedang Diproses</p>
                        <p className="text-blue-300/70 text-xs mt-1">Admin sedang memproses pesanan kamu. Estimasi maks 30 menit.</p>
                      </div>
                    )}

                    {/* Completed: Show account details */}
                    {selectedOrder.status === 'COMPLETED' && selectedOrder.accountEmail && (
                      <div className="mt-5 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm font-semibold mb-3">🎮 Akun Game Kamu</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-black/20 rounded-lg px-3 py-2">
                            <span className="text-green-400/70 text-xs">📧 Email</span>
                            <span className="text-white font-mono text-sm">{selectedOrder.accountEmail}</span>
                          </div>
                          <div className="flex justify-between items-center bg-black/20 rounded-lg px-3 py-2">
                            <span className="text-green-400/70 text-xs">🔑 Password</span>
                            <span className="text-white font-mono text-sm">{selectedOrder.accountPassword}</span>
                          </div>
                        </div>
                        <p className="text-green-400/50 text-xs mt-3">⚠️ Segera ubah password setelah login!</p>
                      </div>
                    )}

                    {/* Cancelled */}
                    {selectedOrder.status === 'CANCELLED' && (
                      <div className="mt-5 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm font-semibold">❌ Pesanan Dibatalkan</p>
                        <p className="text-red-300/70 text-xs mt-1">Pesanan ini telah dibatalkan. Jika sudah bayar, hubungi admin untuk refund.</p>
                      </div>
                    )}

                    {/* View full detail */}
                    <Link
                      href={`/order-status/${selectedOrder.id}`}
                      className="block text-center mt-4 text-[#ee626b] text-sm font-semibold hover:underline"
                    >
                      Lihat Detail Lengkap →
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center sticky top-28">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-gray-400">Pilih pesanan untuk melihat detail</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
