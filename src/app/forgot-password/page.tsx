'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan');
      } else {
        setMessage(data.message);
        setSent(true);
      }
    } catch {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/images/logo.svg" alt="ZOGAMING" width={160} height={32} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Lupa Password</h1>
          <p className="text-slate-400 mt-2">Masukkan email untuk mendapatkan password baru via WhatsApp</p>
        </div>

        <div className="bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="text-lg font-bold text-white">Password Baru Dikirim!</h2>
              <p className="text-slate-400 text-sm">{message}</p>
              <p className="text-slate-500 text-xs">Cek WhatsApp kamu untuk melihat password baru. Setelah login, segera ubah password di menu Dashboard.</p>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[#ee626b] text-white font-semibold rounded-xl hover:bg-[#d4555d] transition-colors mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Login Sekarang
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full h-12 px-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-[#ee626b] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Password baru akan dikirim ke nomor WhatsApp yang terdaftar di akun kamu. Pastikan nomor WhatsApp kamu aktif.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#ee626b] text-white font-semibold rounded-xl hover:bg-[#d4555d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Password Baru via WhatsApp'
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-slate-400 text-sm hover:text-white transition-colors">
              &larr; Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
