'use client';

import { useState, useEffect, useCallback } from 'react';

interface Admin {
  id: number;
  name: string;
  whatsapp: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminManagePage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admins');
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const openAdd = () => {
    setEditingAdmin(null);
    setName('');
    setWhatsapp('');
    setShowForm(true);
    setMessage('');
  };

  const openEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setWhatsapp(admin.whatsapp);
    setShowForm(true);
    setMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;
    setSaving(true);
    setMessage('');

    try {
      if (editingAdmin) {
        const res = await fetch(`/api/admins/${editingAdmin.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, whatsapp }),
        });
        if (res.ok) {
          setMessage('Admin berhasil diupdate!');
        } else {
          setMessage('Gagal update admin');
        }
      } else {
        const res = await fetch('/api/admins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, whatsapp }),
        });
        if (res.ok) {
          setMessage('Admin berhasil ditambahkan!');
        } else {
          setMessage('Gagal menambahkan admin');
        }
      }
      fetchAdmins();
      setTimeout(() => { setShowForm(false); setMessage(''); }, 1500);
    } catch {
      setMessage('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, adminName: string) => {
    if (!confirm(`Hapus admin "${adminName}"?`)) return;
    try {
      await fetch(`/api/admins/${id}`, { method: 'DELETE' });
      fetchAdmins();
    } catch {
      alert('Gagal menghapus admin');
    }
  };

  const handleToggleActive = async (admin: Admin) => {
    try {
      await fetch(`/api/admins/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !admin.active }),
      });
      fetchAdmins();
    } catch {
      alert('Gagal update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Tambah dan kelola admin WhatsApp untuk routing pesanan</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-[#ee626b] text-white text-sm font-semibold rounded-xl hover:bg-[#d4555d] transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Admin
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
        <p className="text-blue-400 text-sm">
          <strong>Sistem Round-Robin:</strong> Pesanan akan otomatis diarahkan ke admin secara bergiliran.
          Admin 1 dapat pesanan pertama, Admin 2 dapat pesanan kedua, dan seterusnya.
          Hanya admin yang <span className="text-green-400">aktif</span> yang akan menerima pesanan.
        </p>
      </div>

      {/* Admin List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#ee626b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : admins.length === 0 ? (
        <div className="bg-[#1e293b] rounded-2xl p-12 text-center border border-slate-700/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="mx-auto mb-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <h3 className="text-white font-semibold mb-1">Belum Ada Admin</h3>
          <p className="text-slate-400 text-sm mb-4">Tambahkan admin pertama untuk mulai menerima pesanan via WhatsApp</p>
          <button onClick={openAdd} className="px-5 py-2.5 bg-[#ee626b] text-white text-sm font-semibold rounded-xl hover:bg-[#d4555d] transition-colors">
            Tambah Admin Pertama
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {admins.map((admin, idx) => (
            <div key={admin.id} className={`bg-[#1e293b] rounded-2xl p-5 border ${admin.active ? 'border-slate-700/50' : 'border-slate-700/30 opacity-60'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 ${admin.active ? 'bg-gradient-to-br from-[#ee626b] to-[#d4555d]' : 'bg-slate-700'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{admin.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${admin.active ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/50 text-slate-400'}`}>
                      {admin.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span className="text-slate-400 text-sm">{admin.whatsapp}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Admin #{idx + 1} — Menerima pesanan urutan ke-{idx + 1} setiap siklus</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(admin)}
                    className={`p-2 rounded-lg transition-colors ${admin.active ? 'hover:bg-amber-500/20 text-amber-400' : 'hover:bg-green-500/20 text-green-400'}`}
                    title={admin.active ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {admin.active ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                  <button onClick={() => openEdit(admin)} className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => handleDelete(admin.id, admin.name)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors" title="Hapus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#1e293b] rounded-2xl p-6 shadow-2xl w-full max-w-md border border-slate-700/50">
            <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 className="text-lg font-bold text-white mb-4">{editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}</h3>

            {message && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${message.includes('berhasil') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nama Admin</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Admin Rifki"
                  className="w-full h-11 px-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-[#ee626b] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 6285954092060"
                  className="w-full h-11 px-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-[#ee626b] focus:outline-none"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Format: kode negara + nomor (tanpa + atau 0). Contoh: 628xxx</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full h-11 bg-[#ee626b] text-white font-semibold rounded-xl hover:bg-[#d4555d] transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : editingAdmin ? 'Update Admin' : 'Tambah Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
