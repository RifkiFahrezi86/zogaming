'use client';

import { useState } from 'react';
import { useData } from '@/lib/DataContext';
import { Badge, BadgeIconType } from '@/lib/types';
import { badgeIcons, BadgeDisplay, BADGE_ICON_OPTIONS } from '@/components/ui/BadgeIcon';

const COLOR_PRESETS = [
    { label: 'Emerald', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Violet', value: '#8b5cf6' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Pink', value: '#ec4899' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Lime', value: '#84cc16' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Indigo', value: '#6366f1' },
];

export default function AdminBadgesPage() {
    const { badges, products, addBadge, updateBadge, deleteBadge } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

    const [formData, setFormData] = useState({
        label: '',
        color: '#10b981',
        textColor: '#ffffff',
        icon: 'bolt' as BadgeIconType,
        active: true,
    });

    const openAddModal = () => {
        setEditingBadge(null);
        setFormData({
            label: '',
            color: '#10b981',
            textColor: '#ffffff',
            icon: 'bolt',
            active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (badge: Badge) => {
        setEditingBadge(badge);
        setFormData({
            label: badge.label,
            color: badge.color,
            textColor: badge.textColor,
            icon: badge.icon,
            active: badge.active,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const badgeData = {
            label: formData.label,
            color: formData.color,
            textColor: formData.textColor,
            icon: formData.icon,
            active: formData.active,
        };

        if (editingBadge) {
            updateBadge(editingBadge.id, badgeData);
        } else {
            addBadge(badgeData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        const usedBy = products.filter(p => p.badge === id);
        const msg = usedBy.length > 0
            ? `This badge is used by ${usedBy.length} product(s). Deleting it will remove the badge from those products. Continue?`
            : 'Are you sure you want to delete this badge?';
        if (confirm(msg)) {
            deleteBadge(id);
        }
    };

    const getUsageCount = (badgeId: string) => {
        return products.filter(p => p.badge === badgeId).length;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Badges</h1>
                    <p className="text-slate-400">Create and manage product badges like &quot;Instant Delivery&quot;, &quot;Best Seller&quot;, etc.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#010101] text-white rounded-xl font-medium hover:bg-[#000000] transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Badge
                </button>
            </div>

            {/* Badge Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => {
                    const usage = getUsageCount(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`admin-card p-5 relative ${!badge.active ? 'opacity-60' : ''}`}
                        >
                            {/* Active indicator */}
                            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${badge.active ? 'bg-green-500' : 'bg-slate-600'}`} />

                            {/* Badge preview */}
                            <div className="mb-4 flex items-center gap-3">
                                <BadgeDisplay badge={badge} size="lg" />
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">ID</span>
                                    <span className="text-slate-300 font-mono text-xs">{badge.id}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Color</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: badge.color }} />
                                        <span className="text-slate-300 font-mono text-xs">{badge.color}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Text Color</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: badge.textColor }} />
                                        <span className="text-slate-300 font-mono text-xs">{badge.textColor}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Icon</span>
                                    <span className="text-slate-300 capitalize">{badge.icon}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Used by</span>
                                    <span className="text-slate-300">{usage} product{usage !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Status</span>
                                    <span className={badge.active ? 'text-green-400' : 'text-slate-500'}>
                                        {badge.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-slate-700/50">
                                <button
                                    onClick={() => openEditModal(badge)}
                                    className="flex-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(badge.id)}
                                    className="px-3 py-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                {badges.length === 0 && (
                    <div className="col-span-full admin-card p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <p className="text-slate-400 mb-2">No badges created yet</p>
                        <p className="text-slate-500 text-sm">Create your first badge to display on products</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingBadge ? 'Edit Badge' : 'Create New Badge'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Live Preview */}
                            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-3">Preview</label>
                                <div className="flex justify-center">
                                    <BadgeDisplay
                                        badge={{
                                            id: editingBadge?.id || 'preview',
                                            label: formData.label || 'Badge Label',
                                            color: formData.color,
                                            textColor: formData.textColor,
                                            icon: formData.icon,
                                            active: formData.active,
                                        }}
                                        size="lg"
                                    />
                                </div>
                            </div>

                            {/* Label */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Badge Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                                    placeholder="e.g., Instant Delivery"
                                    required
                                />
                            </div>

                            {/* Colors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Background Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="flex-1 h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm outline-none focus:border-[#010101]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.textColor}
                                            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                                            className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={formData.textColor}
                                            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                                            className="flex-1 h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm outline-none focus:border-[#010101]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Color Presets */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Quick Colors</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_PRESETS.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: preset.value })}
                                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                                formData.color === preset.value
                                                    ? 'border-white scale-110'
                                                    : 'border-transparent hover:border-slate-500'
                                            }`}
                                            style={{ backgroundColor: preset.value }}
                                            title={preset.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {BADGE_ICON_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: opt.value as BadgeIconType })}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                                                formData.icon === opt.value
                                                    ? 'border-white bg-slate-700 text-white'
                                                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                                            }`}
                                        >
                                            <div className="w-5 h-5">
                                                {badgeIcons[opt.value as keyof typeof badgeIcons]}
                                            </div>
                                            <span className="text-xs capitalize">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active toggle */}
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className="text-sm font-medium text-slate-300">Active</span>
                                        <p className="text-xs text-slate-500 mt-0.5">When disabled, badge won&apos;t be displayed on products</p>
                                    </div>
                                    <div
                                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                                            formData.active ? 'bg-green-500' : 'bg-slate-600'
                                        }`}
                                        onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    >
                                        <div
                                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                                formData.active ? 'translate-x-[22px]' : 'translate-x-0.5'
                                            }`}
                                        />
                                    </div>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#010101] text-white rounded-xl font-medium hover:bg-[#000000] transition-colors"
                                >
                                    {editingBadge ? 'Update Badge' : 'Create Badge'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
