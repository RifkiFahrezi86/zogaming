'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useData } from '@/lib/DataContext';
import { formatRupiah } from '@/lib/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/ui/Preloader';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { user, loading: authLoading } = useAuth();
  const { cart, products, clearCart, settings } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Items to checkout: either single product or cart
  const [checkoutItems, setCheckoutItems] = useState<Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }>>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout' + (productId ? `?productId=${productId}` : ''));
      return;
    }

    if (user) {
      setCustomerName(user.name);
      setCustomerEmail(user.email);
      setCustomerPhone(user.phone || '');
    }
  }, [user, authLoading, router, productId]);

  useEffect(() => {
    if (productId) {
      // Single product buy
      const product = products.find(p => p.id === productId);
      if (product) {
        setCheckoutItems([{
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          quantity: 1,
          price: product.salePrice || product.price,
        }]);
      }
    } else if (cart.length > 0) {
      // Cart checkout
      setCheckoutItems(cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
      })));
    }
  }, [productId, products, cart]);

  const total = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName || !customerPhone) {
      setError('Nama dan nomor WhatsApp wajib diisi');
      return;
    }

    if (checkoutItems.length === 0) {
      setError('Tidak ada produk untuk dipesan');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          items: checkoutItems,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal membuat pesanan');
        setSubmitting(false);
        return;
      }

      setOrderId(data.orderId);
      setSuccess(true);

      // Clear cart if ordering from cart
      if (!productId) {
        clearCart();
      }
    } catch {
      setError('Terjadi kesalahan jaringan');
      setSubmitting(false);
    }
  };

  const getWhatsAppUrl = () => {
    const adminPhone = settings.adminWhatsApp || process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6285954092060';
    const itemsList = checkoutItems.map(item => 
      `- ${item.productName} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
    ).join('\n');

    const message = `Halo Admin ZOGAMING! 👋\n\n` +
      `Saya sudah memesan di website:\n\n` +
      `📋 *Order #${orderId}*\n` +
      `👤 Nama: ${customerName}\n` +
      `📧 Email: ${customerEmail}\n\n` +
      `📦 Produk:\n${itemsList}\n\n` +
      `💰 *Total: ${formatRupiah(total)}*\n\n` +
      `Mohon konfirmasi pembayaran dan kirim akun game. Terima kasih! 🙏`;

    return `https://wa.me/${adminPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  if (authLoading) {
    return <Preloader />;
  }

  if (!user) {
    return null;
  }

  // Success state
  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-40 pb-20">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
              <p className="text-gray-500 mb-2">Order #{orderId}</p>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Pesanan:</p>
                {checkoutItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.productName} x{item.quantity}</span>
                    <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t mt-3 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">{formatRupiah(total)}</span>
                </div>
              </div>

              {/* Steps - Easy to understand */}
              <div className="bg-blue-50 rounded-2xl p-5 mb-6 text-left">
                <p className="font-bold text-blue-900 mb-3">Langkah Selanjutnya:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <p className="text-sm text-blue-800">Klik tombol <strong>&quot;Chat Admin di WhatsApp&quot;</strong> di bawah</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <p className="text-sm text-blue-800">Kirim pesan ke Admin untuk <strong>konfirmasi pembayaran</strong></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <p className="text-sm text-blue-800">Admin akan mengirim <strong>akun dan password game</strong> melalui WhatsApp</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                    <p className="text-sm text-green-800">Setelah selesai, pesanan kamu berubah jadi <strong>COMPLETE</strong></p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-3 text-lg mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat Admin di WhatsApp
              </a>

              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 flex items-center justify-center text-sm">
                  Lihat Pesanan Saya
                </Link>
                <Link href="/shop" className="flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 flex items-center justify-center text-sm">
                  Belanja Lagi
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Preloader />
      <Header />
      <div className="min-h-screen bg-gray-50 pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-500 mb-8">Periksa pesanan kamu sebelum melanjutkan</p>

          {checkoutItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
              <p className="text-gray-500 mb-4">Kamu belum memilih produk apapun</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[#ee626b] text-white font-semibold rounded-full hover:bg-[#d4555d] transition-colors">
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left - Products */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      Produk yang Dipesan ({totalItems} item)
                    </h2>
                    <div className="space-y-3">
                      {checkoutItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.productImage} alt={item.productName} width={64} height={64} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">{item.productName}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-gray-900">{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Data Pemesan
                    </h2>

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:border-[#ee626b] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:border-[#ee626b] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp * <span className="text-gray-400 font-normal">(untuk konfirmasi pesanan)</span></label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="628xxxxxxxxxx"
                          className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:border-[#ee626b] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder="Contoh: Mau akun region US"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#ee626b] focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Summary */}
                <div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h2>

                    <div className="space-y-2 mb-4">
                      {checkoutItems.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600 truncate max-w-[60%]">{item.productName} x{item.quantity}</span>
                          <span className="font-medium text-gray-900">{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-[#ee626b]">{formatRupiah(total)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{totalItems} produk dipesan</p>
                    </div>

                    {/* How it works - Simple */}
                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                      <p className="text-xs font-bold text-green-800 mb-2">Cara Pembayaran:</p>
                      <div className="space-y-1.5">
                        <p className="text-xs text-green-700 flex items-start gap-2">
                          <span className="font-bold">1.</span> Pesan dulu di sini
                        </p>
                        <p className="text-xs text-green-700 flex items-start gap-2">
                          <span className="font-bold">2.</span> Chat Admin via WhatsApp
                        </p>
                        <p className="text-xs text-green-700 flex items-start gap-2">
                          <span className="font-bold">3.</span> Bayar & terima akun game
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || checkoutItems.length === 0}
                      className="w-full h-12 bg-[#ee626b] text-white font-bold rounded-xl hover:bg-[#d4555d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                          Pesan Sekarang
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
