'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SiteSettings {
    siteName: string;
    tagline: string;
    logo: { url: string; alt: string };
    favicon: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    social: {
        facebook: string;
        instagram: string;
        twitter: string;
        pinterest: string;
        youtube: string;
    };
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
        ogImage: string;
    };
    store: {
        currency: string;
        currencySymbol: string;
        taxRate: number;
        freeShippingThreshold: number;
        shippingCost: number;
    };
    features: {
        enableWishlist: boolean;
        enableReviews: boolean;
        enableQuickView: boolean;
        enableCompare: boolean;
        maintenanceMode: boolean;
    };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('branding');
    const [message, setMessage] = useState({ type: '', text: '' });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_URL}/api/settings`);
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to save settings' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving settings' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const updateField = (section: string, field: string, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            [section]: {
                ...(settings as any)[section],
                [field]: value
            }
        });
    };

    const updateTopLevel = (field: string, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!settings) {
        return <div className="p-6">Failed to load settings</div>;
    }

    const tabs = [
        { id: 'branding', label: 'Branding', icon: '🎨' },
        { id: 'colors', label: 'Colors', icon: '🌈' },
        { id: 'contact', label: 'Contact', icon: '📞' },
        { id: 'social', label: 'Social', icon: '📱' },
        { id: 'seo', label: 'SEO', icon: '🔍' },
        { id: 'store', label: 'Store', icon: '🛒' },
        { id: 'features', label: 'Features', icon: '⚙️' }
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
                    <p className="text-gray-600 mt-1">Configure your Lazywalls store</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Saving...
                        </>
                    ) : (
                        <>💾 Save Changes</>
                    )}
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${activeTab === tab.id
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Branding Tab */}
                {activeTab === 'branding' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-3">Branding</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => updateTopLevel('siteName', e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                <input
                                    type="text"
                                    value={settings.tagline}
                                    onChange={(e) => updateTopLevel('tagline', e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                            <input
                                type="text"
                                value={settings.logo?.url || ''}
                                onChange={(e) => updateTopLevel('logo', { ...settings.logo, url: e.target.value })}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="https://example.com/logo.png"
                            />
                            {settings.logo?.url && (
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                                    <img src={settings.logo.url} alt="Logo preview" className="h-12 object-contain" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                            <input
                                type="text"
                                value={settings.favicon || ''}
                                onChange={(e) => updateTopLevel('favicon', e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="https://example.com/favicon.ico"
                            />
                        </div>
                    </div>
                )}

                {/* Colors Tab */}
                {activeTab === 'colors' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-3">Color Scheme</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(settings.colors).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key} Color</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            value={value}
                                            onChange={(e) => updateField('colors', key, e.target.value)}
                                            className="w-14 h-12 rounded cursor-pointer border"
                                        />
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => updateField('colors', key, e.target.value)}
                                            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preview */}
                        <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: settings.colors.background }}>
                            <h3 className="text-lg font-semibold mb-2" style={{ color: settings.colors.text }}>Preview</h3>
                            <p style={{ color: settings.colors.text }}>This is how your text will look.</p>
                            <div className="mt-4 flex gap-3">
                                <button className="px-4 py-2 rounded" style={{ backgroundColor: settings.colors.primary, color: '#fff' }}>Primary</button>
                                <button className="px-4 py-2 rounded" style={{ backgroundColor: settings.colors.secondary, color: '#000' }}>Secondary</button>
                                <button className="px-4 py-2 rounded" style={{ backgroundColor: settings.colors.accent, color: '#fff' }}>Accent</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-3">Contact Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={settings.contact?.email || ''}
                                    onChange={(e) => updateField('contact', 'email', e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={settings.contact?.phone || ''}
                                    onChange={(e) => updateField('contact', 'phone', e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <textarea
                                value={settings.contact?.address || ''}
                                onChange={(e) => updateField('contact', 'address', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                {/* Social Tab */}
                {activeTab === 'social' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-3">Social Media Links</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.entries(settings.social || {}).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                                    <input
                                        type="url"
                                        value={value}
                                        onChange={(e) => updateField('social', key, e.target.value)}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                        placeholder={`https://${key}.com/yourpage`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-3">SEO Settings</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                            <input
                                type="text"
                                value={settings.seo?.metaTitle || ''}
                                onChange={(e) => updateField('seo', 'metaTitle', e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                            <p className="text-sm text-gray-500 mt-1">{(settings.seo?.metaTitle || '').length}/60 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                            <textarea
                                value={settings.seo?.metaDescription || ''}
                                onChange={(e) => updateField('seo', 'metaDescription', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                            <p className="text-sm text-gray-500 mt-1">{(settings.seo?.metaDescription || '').length}/160 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
                            <input
                                type="text"
                                value={settings.seo?.ogImage || ''}
                                onChange={(e) => updateField('seo', 'ogImage', e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="https://example.com/og-image.jpg"
                            />
                        </div>
                    </div>
                )}

                {/* Store Tab */}
                {activeTab === 'store' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-3">Store Settings</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                <select
                                    value={settings.store?.currency || 'INR'}
                                    onChange={(e) => updateField('store', 'currency', e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                >
                                    <option value="INR">INR - Indian Rupee</option>
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                                <input
                                    type="text"
                                    value={settings.store?.currencySymbol || '₹'}
                                    onChange={(e) => updateField('store', 'currencySymbol', e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    value={settings.store?.taxRate || 18}
                                    onChange={(e) => updateField('store', 'taxRate', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
                                <input
                                    type="number"
                                    value={settings.store?.shippingCost || 99}
                                    onChange={(e) => updateField('store', 'shippingCost', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                                <input
                                    type="number"
                                    value={settings.store?.freeShippingThreshold || 999}
                                    onChange={(e) => updateField('store', 'freeShippingThreshold', parseFloat(e.target.value))}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">Orders above this amount get free shipping</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold border-b pb-3">Feature Toggles</h2>

                        <div className="space-y-4">
                            {Object.entries(settings.features || {}).map(([key, value]) => (
                                <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                                    <div>
                                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <p className="text-sm text-gray-500">
                                            {key === 'maintenanceMode'
                                                ? 'Enable to show maintenance page to visitors'
                                                : `Enable or disable ${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`
                                            }
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) => updateField('features', key, e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-14 h-8 rounded-full transition ${value ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
