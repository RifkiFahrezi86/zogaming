'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/lib/DataContext';

export default function AdminSettingsPage() {
    const { settings, updateSettings } = useData();
    const [formData, setFormData] = useState(settings);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-slate-400">Configure your store settings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="admin-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">General Settings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Logo URL</label>
                            <input
                                type="text"
                                value={formData.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Section Settings */}
                <div className="admin-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Hero Section</h2>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Hero Title</label>
                                <input
                                    type="text"
                                    value={formData.heroTitle || ''}
                                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                    className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                                    placeholder="Welcome to ZOGAMING"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Hero Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.heroSubtitle || ''}
                                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                    className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                                    placeholder="BROWSE ONLINE"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Hero Description</label>
                            <textarea
                                value={formData.heroDescription || ''}
                                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101] resize-none"
                                placeholder="Discover the best games at unbeatable prices..."
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="admin-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="admin-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Social Media Links</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Facebook</label>
                            <input
                                type="text"
                                value={formData.socialLinks.facebook || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                                })}
                                className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Twitter</label>
                            <input
                                type="text"
                                value={formData.socialLinks.twitter || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                                })}
                                className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Instagram</label>
                            <input
                                type="text"
                                value={formData.socialLinks.instagram || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                                })}
                                className="w-full h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-[#010101]"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#010101] text-white rounded-xl font-medium hover:bg-[#000000] transition-colors"
                    >
                        Save Settings
                    </button>
                    {isSaved && (
                        <span className="text-green-400 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Settings saved successfully!
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
