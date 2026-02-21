'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useData } from '@/lib/DataContext';
import { BannerImage } from '@/lib/types';

const PRESET_COLORS = [
    { color: '#ef4444', label: 'Merah' },
    { color: '#f97316', label: 'Orange' },
    { color: '#f59e0b', label: 'Kuning' },
    { color: '#10b981', label: 'Hijau' },
    { color: '#3b82f6', label: 'Biru' },
    { color: '#8b5cf6', label: 'Ungu' },
    { color: '#ec4899', label: 'Pink' },
    { color: '#06b6d4', label: 'Cyan' },
    { color: '#010101', label: 'Hitam' },
    { color: '#ee626b', label: 'Tema' },
];

export default function AdminBannerImagesPage() {
    const { settings, updateSettings, badges } = useData();
    const [editingImage, setEditingImage] = useState<BannerImage | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [fetchingImage, setFetchingImage] = useState(false);
    const [bannerUrlInput, setBannerUrlInput] = useState('');

    const handleBannerImageUrl = async (url: string) => {
        setBannerUrlInput(url);
        if (!url || url.startsWith('/') || /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(url)) {
            setImageForm(prev => ({ ...prev, imageUrl: url }));
            return;
        }
        if (url.startsWith('http')) {
            setFetchingImage(true);
            try {
                const res = await fetch(`/api/og-image?url=${encodeURIComponent(url)}`);
                const data = await res.json();
                if (data.imageUrl) {
                    setImageForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
                } else {
                    setImageForm(prev => ({ ...prev, imageUrl: url }));
                }
            } catch {
                setImageForm(prev => ({ ...prev, imageUrl: url }));
            } finally {
                setFetchingImage(false);
            }
        }
    };

    const [imageForm, setImageForm] = useState<BannerImage>({
        id: '',
        title: '',
        imageUrl: '/images/banner-bg.jpg',
        badge: null,
        badgeColor: '#ee626b',
        badgeTextColor: '#ffffff',
        active: true,
    });

    const bannerImages = settings.bannerImages || [];

    const openAddForm = () => {
        setEditingImage(null);
        setBannerUrlInput('');
        setImageForm({
            id: 'bi' + Date.now(),
            title: '',
            imageUrl: '/images/banner-bg.jpg',
            badge: null,
            badgeColor: '#ee626b',
            badgeTextColor: '#ffffff',
            active: true,
        });
        setIsFormOpen(true);
    };

    const openEditForm = (image: BannerImage) => {
        setEditingImage(image);
        setBannerUrlInput('');
        setImageForm({ ...image, badgeColor: image.badgeColor || '#ee626b', badgeTextColor: image.badgeTextColor || '#ffffff' });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setEditingImage(null);
        setIsFormOpen(false);
    };

    const saveImage = () => {
        if (!imageForm.title.trim()) return;
        let updated: BannerImage[];

        if (editingImage) {
            updated = bannerImages.map(v => v.id === editingImage.id ? imageForm : v);
        } else {
            if (bannerImages.length >= 6) return;
            updated = [...bannerImages, imageForm];
        }

        updateSettings({ bannerImages: updated });
        setIsFormOpen(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const deleteImage = (id: string) => {
        if (!confirm('Hapus banner ini?')) return;
        const updated = bannerImages.filter(v => v.id !== id);
        updateSettings({ bannerImages: updated });
    };

    const toggleImageActive = (id: string) => {
        const updated = bannerImages.map(v =>
            v.id === id ? { ...v, active: !v.active } : v
        );
        updateSettings({ bannerImages: updated });
    };

    const moveImage = (idx: number, direction: 'up' | 'down') => {
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= bannerImages.length) return;
        const updated = [...bannerImages];
        [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
        updateSettings({ bannerImages: updated });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Banner Images</h1>
                    <p className="text-slate-400">Kelola gambar banner hero section (maks. 6 gambar)</p>
                </div>
                {bannerImages.length < 6 && (
                    <button
                        onClick={openAddForm}
                        className="px-4 py-2 bg-[#ee626b] text-white rounded-xl font-medium hover:bg-[#d4555d] transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Tambah Banner
                    </button>
                )}
            </div>

            {/* Save Notification */}
            {isSaved && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Banner berhasil disimpan!
                </div>
            )}

            {/* Preview */}
            <div className="admin-card p-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Preview Slide Tabs</h2>
                <div className="flex items-center gap-2 flex-wrap bg-slate-900/50 rounded-xl p-4">
                    {bannerImages.filter(v => v.active).map((v) => (
                        <span
                            key={v.id}
                            className="px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-lg"
                            style={{
                                backgroundColor: v.badgeColor || '#ee626b',
                                color: v.badgeTextColor || '#fff',
                                boxShadow: `0 4px 20px ${v.badgeColor || '#ee626b'}40`,
                            }}
                        >
                            {v.title}
                        </span>
                    ))}
                    {bannerImages.filter(v => v.active).length === 0 && (
                        <p className="text-slate-500 text-sm">Belum ada banner aktif</p>
                    )}
                </div>
            </div>

            {/* Banner List */}
            <div className="space-y-3">
                {bannerImages.map((banner, idx) => (
                    <div key={banner.id} className="admin-card p-5 flex items-center gap-4">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-1 flex-shrink-0">
                            <button
                                onClick={() => moveImage(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                            </button>
                            <button
                                onClick={() => moveImage(idx, 'down')}
                                disabled={idx === bannerImages.length - 1}
                                className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                        </div>

                        {/* Image Thumbnail */}
                        <div className="w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 relative">
                            <Image
                                src={banner.imageUrl}
                                alt={banner.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Banner Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                                    style={{ backgroundColor: banner.badgeColor || '#ee626b', color: banner.badgeTextColor || '#fff' }}
                                >
                                    {banner.title}
                                </span>
                                {!banner.active && (
                                    <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-[10px] rounded-full">NONAKTIF</span>
                                )}
                            </div>
                            <p className="text-slate-400 text-xs truncate">{banner.imageUrl}</p>
                            {banner.badge && (
                                <p className="text-slate-500 text-[11px] mt-0.5">
                                    Badge: {badges.find(b => b.id === banner.badge)?.label || banner.badge}
                                </p>
                            )}
                        </div>

                        {/* Active Toggle */}
                        <button
                            onClick={() => toggleImageActive(banner.id)}
                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${banner.active ? 'bg-green-500' : 'bg-slate-600'}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${banner.active ? 'left-[22px]' : 'left-0.5'}`} />
                        </button>

                        {/* Edit */}
                        <button
                            onClick={() => openEditForm(banner)}
                            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Edit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>

                        {/* Delete */}
                        <button
                            onClick={() => deleteImage(banner.id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                            title="Hapus"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                ))}

                {bannerImages.length === 0 && (
                    <div className="admin-card p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="mx-auto mb-4">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <p className="text-slate-400 mb-4">Belum ada banner image</p>
                        <button
                            onClick={openAddForm}
                            className="px-4 py-2 bg-[#ee626b] text-white rounded-xl font-medium hover:bg-[#d4555d] transition-colors text-sm"
                        >
                            Tambah Banner Pertama
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-[#1e293b] rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold text-white">
                                {editingImage ? 'Edit Banner' : 'Tambah Banner Baru'}
                            </h2>
                            <button onClick={closeForm} className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Judul Slide (tampil di atas banner)</label>
                                <input
                                    type="text"
                                    value={imageForm.title}
                                    onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                                    className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#ee626b]"
                                    placeholder="TOP SELLER, COMING SOON, NEW RELEASE..."
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">URL Gambar</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={bannerUrlInput || imageForm.imageUrl}
                                        onChange={(e) => { setBannerUrlInput(e.target.value); setImageForm({ ...imageForm, imageUrl: e.target.value }); }}
                                        onBlur={(e) => handleBannerImageUrl(e.target.value)}
                                        className="flex-1 h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#ee626b]"
                                        placeholder="/images/banner.jpg atau https://store.steampowered.com/app/..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleBannerImageUrl(bannerUrlInput || imageForm.imageUrl)}
                                        disabled={fetchingImage}
                                        className="px-3 h-10 bg-slate-700 text-white text-xs rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-50 flex-shrink-0"
                                    >
                                        {fetchingImage ? (
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                        ) : 'Ambil'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Paste URL halaman web — gambar diambil otomatis. Atau paste URL gambar langsung.</p>
                                {imageForm.imageUrl && imageForm.imageUrl !== bannerUrlInput && bannerUrlInput && (
                                    <p className="text-xs text-green-400 mt-1">Gambar ditemukan!</p>
                                )}
                                {/* Image Preview */}
                                {imageForm.imageUrl && (
                                    <div className="mt-3 rounded-xl overflow-hidden bg-slate-800 aspect-video relative">
                                        <Image
                                            src={imageForm.imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Badge Color */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Warna Badge</label>
                                <div className="flex items-center flex-wrap gap-2 mb-3">
                                    {PRESET_COLORS.map((preset) => (
                                        <button
                                            key={preset.color}
                                            type="button"
                                            onClick={() => setImageForm({ ...imageForm, badgeColor: preset.color, badgeTextColor: preset.color === '#f59e0b' ? '#000000' : '#ffffff' })}
                                            className={`w-8 h-8 rounded-lg transition-all border-2 ${imageForm.badgeColor === preset.color ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'}`}
                                            style={{ backgroundColor: preset.color }}
                                            title={preset.label}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-400">Custom:</label>
                                        <input
                                            type="color"
                                            value={imageForm.badgeColor}
                                            onChange={(e) => setImageForm({ ...imageForm, badgeColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-slate-400">Teks:</label>
                                        <button
                                            type="button"
                                            onClick={() => setImageForm({ ...imageForm, badgeTextColor: imageForm.badgeTextColor === '#ffffff' ? '#000000' : '#ffffff' })}
                                            className="px-3 py-1 rounded-lg text-xs font-bold border border-slate-600"
                                            style={{ backgroundColor: imageForm.badgeTextColor, color: imageForm.badgeTextColor === '#ffffff' ? '#000' : '#fff' }}
                                        >
                                            {imageForm.badgeTextColor === '#ffffff' ? 'Putih' : 'Hitam'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Badge */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Preview Badge</label>
                                <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-center">
                                    <span
                                        className="px-6 py-2.5 rounded-full text-sm font-extrabold uppercase tracking-wider shadow-lg"
                                        style={{
                                            backgroundColor: imageForm.badgeColor,
                                            color: imageForm.badgeTextColor,
                                            boxShadow: `0 6px 25px ${imageForm.badgeColor}50`,
                                        }}
                                    >
                                        {imageForm.title || 'JUDUL SLIDE'}
                                    </span>
                                </div>
                            </div>

                            {/* Badge Link (optional) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Product Badge (opsional)</label>
                                <select
                                    value={imageForm.badge || ''}
                                    onChange={(e) => setImageForm({ ...imageForm, badge: e.target.value || null })}
                                    className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#ee626b]"
                                >
                                    <option value="">Tanpa Badge</option>
                                    {badges.filter(b => b.active).map((badge) => (
                                        <option key={badge.id} value={badge.id}>{badge.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Active */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={imageForm.active}
                                    onChange={(e) => setImageForm({ ...imageForm, active: e.target.checked })}
                                    className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-green-500"
                                />
                                <span className="text-sm text-slate-300">Banner Aktif</span>
                            </label>
                        </div>

                        <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3">
                            <button
                                onClick={closeForm}
                                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveImage}
                                className="px-6 py-2 bg-[#ee626b] text-white rounded-xl font-medium hover:bg-[#d4555d] transition-colors"
                            >
                                {editingImage ? 'Update Banner' : 'Simpan Banner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
