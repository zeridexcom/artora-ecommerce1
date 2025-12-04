'use client';

import React, { useState, useEffect } from 'react';

// Section types available for the theme editor
const SECTION_TYPES = [
    { type: 'hero-banner', label: 'Hero Banner', icon: '🖼️', description: 'Full-width banner with text overlay' },
    { type: 'hero-video', label: 'Hero Video', icon: '🎬', description: 'Video background hero section' },
    { type: 'collection-grid', label: 'Collection Grid', icon: '🔲', description: 'Grid of collection images' },
    { type: 'product-grid', label: 'Product Grid', icon: '🏷️', description: 'Display products in a grid' },
    { type: 'product-tabs', label: 'Product Tabs', icon: '📑', description: 'Tabbed product display' },
    { type: 'promo-banner', label: 'Promo Banner', icon: '📢', description: 'Promotional content section' },
    { type: 'image-text', label: 'Image + Text', icon: '📝', description: 'Image with text content' },
    { type: 'text-block', label: 'Text Block', icon: '✍️', description: 'Rich text content' },
    { type: 'newsletter', label: 'Newsletter', icon: '📧', description: 'Email signup form' },
    { type: 'testimonials', label: 'Testimonials', icon: '💬', description: 'Customer reviews' },
    { type: 'video-section', label: 'Video Section', icon: '🎥', description: 'Embedded video' },
    { type: 'faq-section', label: 'FAQ', icon: '❓', description: 'Frequently asked questions' }
];

interface Section {
    sectionId: string;
    sectionType: string;
    order: number;
    visible: boolean;
    settings: Record<string, any>;
}

interface PageTemplate {
    _id: string;
    pageId: string;
    pageName: string;
    sections: Section[];
    isPublished: boolean;
}

export default function ThemeEditorPage() {
    const [pages, setPages] = useState<PageTemplate[]>([]);
    const [selectedPage, setSelectedPage] = useState<string>('home');
    const [currentPage, setCurrentPage] = useState<PageTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [showAddSection, setShowAddSection] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchPage(selectedPage);
    }, [selectedPage]);

    const fetchPage = async (pageId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/themes/${pageId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentPage(data);
            }
        } catch (error) {
            console.error('Failed to fetch page:', error);
        } finally {
            setLoading(false);
        }
    };

    const savePage = async () => {
        if (!currentPage) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/themes/${currentPage.pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sections: currentPage.sections
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Page saved successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to save page' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving page' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const publishPage = async () => {
        if (!currentPage) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/themes/${currentPage.pageId}/publish`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Page published!' });
                fetchPage(currentPage.pageId);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to publish' });
        }
    };

    const addSection = async (sectionType: string) => {
        if (!currentPage) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/themes/${currentPage.pageId}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sectionType,
                    settings: getDefaultSettings(sectionType)
                })
            });

            if (res.ok) {
                fetchPage(currentPage.pageId);
                setShowAddSection(false);
            }
        } catch (error) {
            console.error('Failed to add section:', error);
        }
    };

    const updateSection = (sectionId: string, updates: Partial<Section>) => {
        if (!currentPage) return;

        const updatedSections = currentPage.sections.map(section =>
            section.sectionId === sectionId
                ? { ...section, ...updates }
                : section
        );

        setCurrentPage({ ...currentPage, sections: updatedSections });
    };

    const updateSectionSettings = (sectionId: string, settingKey: string, value: any) => {
        if (!currentPage) return;

        const updatedSections = currentPage.sections.map(section =>
            section.sectionId === sectionId
                ? { ...section, settings: { ...section.settings, [settingKey]: value } }
                : section
        );

        setCurrentPage({ ...currentPage, sections: updatedSections });
    };

    const deleteSection = async (sectionId: string) => {
        if (!currentPage) return;
        if (!confirm('Are you sure you want to delete this section?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/themes/${currentPage.pageId}/sections/${sectionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                fetchPage(currentPage.pageId);
                setSelectedSection(null);
            }
        } catch (error) {
            console.error('Failed to delete section:', error);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index || !currentPage) return;

        const newSections = [...currentPage.sections];
        const [draggedSection] = newSections.splice(draggedIndex, 1);
        newSections.splice(index, 0, draggedSection);

        // Update order values
        newSections.forEach((section, i) => {
            section.order = i;
        });

        setCurrentPage({ ...currentPage, sections: newSections });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const getDefaultSettings = (type: string): Record<string, any> => {
        const defaults: Record<string, Record<string, any>> = {
            'hero-banner': {
                heading: 'Welcome to Lazywalls',
                subheading: 'Premium Wall Posters & Stickers',
                buttonText: 'Shop Now',
                buttonLink: '/collections',
                overlayOpacity: 0.3,
                textColor: '#ffffff',
                alignment: 'center'
            },
            'hero-video': {
                heading: 'Transform Your Space',
                backgroundVideo: '/videos/hero.mp4',
                overlayOpacity: 0.4
            },
            'collection-grid': {
                columns: 4,
                showTitle: true
            },
            'product-grid': {
                columns: 4,
                rows: 2,
                showTitle: true,
                showPrice: true,
                showAddToCart: true
            },
            'promo-banner': {
                badge: 'SALE',
                title: 'Up to 50% Off',
                description: 'Limited time offer on selected items',
                ctaText: 'Shop Sale',
                ctaLink: '/sale',
                layout: 'image-left'
            },
            'text-block': {
                content: 'Add your content here...',
                padding: 'medium'
            },
            'newsletter': {
                sectionTitle: 'Subscribe to our Newsletter',
                description: 'Get updates on new arrivals and exclusive offers'
            }
        };
        return defaults[type] || {};
    };

    const getSectionLabel = (type: string) => {
        return SECTION_TYPES.find(s => s.type === type)?.label || type;
    };

    const getSectionIcon = (type: string) => {
        return SECTION_TYPES.find(s => s.type === type)?.icon || '📦';
    };

    const selectedSectionData = currentPage?.sections.find(s => s.sectionId === selectedSection);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">🎨 Theme Editor</h1>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    >
                        <option value="home">Homepage</option>
                        <option value="about">About Page</option>
                        <option value="contact">Contact Page</option>
                        <option value="collection">Collection Page</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    {message.text && (
                        <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={savePage}
                        disabled={saving}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : '💾 Save Draft'}
                    </button>
                    <button
                        onClick={publishPage}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        🚀 Publish
                    </button>
                </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sections List - Left Panel */}
                <div className="w-72 bg-gray-50 border-r overflow-y-auto">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Sections</h2>
                            <button
                                onClick={() => setShowAddSection(true)}
                                className="w-8 h-8 bg-black text-white rounded-full hover:bg-gray-800 transition flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        {/* Section List */}
                        <div className="space-y-2">
                            {(currentPage?.sections || []).map((section, index) => (
                                <div
                                    key={section.sectionId}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => setSelectedSection(section.sectionId)}
                                    className={`p-3 rounded-lg cursor-pointer transition flex items-center gap-3 ${selectedSection === section.sectionId
                                            ? 'bg-black text-white'
                                            : 'bg-white hover:bg-gray-100 border'
                                        } ${draggedIndex === index ? 'opacity-50' : ''}`}
                                >
                                    <span className="cursor-move">⋮⋮</span>
                                    <span>{getSectionIcon(section.sectionType)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{getSectionLabel(section.sectionType)}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateSection(section.sectionId, { visible: !section.visible });
                                        }}
                                        className={`text-sm ${selectedSection === section.sectionId ? 'text-white/70' : 'text-gray-400'}`}
                                    >
                                        {section.visible ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            ))}

                            {(!currentPage?.sections || currentPage.sections.length === 0) && (
                                <p className="text-center text-gray-500 py-8">
                                    No sections yet.<br />Click + to add one.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview - Center Panel */}
                <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
                        <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="ml-4 text-gray-400">lazywalls.com</span>
                        </div>

                        <div className="min-h-96">
                            {(currentPage?.sections || [])
                                .filter(s => s.visible)
                                .map((section) => (
                                    <div
                                        key={section.sectionId}
                                        onClick={() => setSelectedSection(section.sectionId)}
                                        className={`relative cursor-pointer transition ${selectedSection === section.sectionId ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                    >
                                        {/* Section Preview based on type */}
                                        <SectionPreview section={section} />

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-blue-500/0 hover:bg-blue-500/10 transition flex items-center justify-center opacity-0 hover:opacity-100">
                                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                                Click to Edit
                                            </span>
                                        </div>
                                    </div>
                                ))}

                            {(!currentPage?.sections || currentPage.sections.filter(s => s.visible).length === 0) && (
                                <div className="h-96 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <p className="text-4xl mb-4">🎨</p>
                                        <p>Add sections to build your page</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings - Right Panel */}
                <div className="w-80 bg-white border-l overflow-y-auto">
                    {selectedSectionData ? (
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold">
                                    {getSectionIcon(selectedSectionData.sectionType)} {getSectionLabel(selectedSectionData.sectionType)}
                                </h2>
                                <button
                                    onClick={() => deleteSection(selectedSectionData.sectionId)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    🗑️
                                </button>
                            </div>

                            {/* Section Settings */}
                            <SectionSettings
                                section={selectedSectionData}
                                onUpdate={(key, value) => updateSectionSettings(selectedSectionData.sectionId, key, value)}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="text-center p-6">
                                <p className="text-4xl mb-4">👆</p>
                                <p>Select a section to edit its settings</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Section Modal */}
            {showAddSection && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">Add Section</h2>
                            <button onClick={() => setShowAddSection(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-96">
                            {SECTION_TYPES.map((section) => (
                                <button
                                    key={section.type}
                                    onClick={() => addSection(section.type)}
                                    className="p-4 border rounded-xl hover:border-black hover:bg-gray-50 transition text-left"
                                >
                                    <span className="text-2xl">{section.icon}</span>
                                    <p className="font-medium mt-2">{section.label}</p>
                                    <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Section Preview Component
function SectionPreview({ section }: { section: Section }) {
    const { sectionType, settings } = section;

    switch (sectionType) {
        case 'hero-banner':
        case 'hero-video':
            return (
                <div
                    className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative"
                    style={{ backgroundColor: settings.backgroundColor }}
                >
                    {settings.backgroundImage && (
                        <img src={settings.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black" style={{ opacity: settings.overlayOpacity || 0.3 }}></div>
                    <div className="relative text-center text-white z-10 p-6">
                        <h2 className="text-3xl font-bold mb-2">{settings.heading || 'Hero Banner'}</h2>
                        <p className="mb-4">{settings.subheading}</p>
                        {settings.buttonText && (
                            <button className="px-6 py-2 bg-white text-black rounded-full">
                                {settings.buttonText}
                            </button>
                        )}
                    </div>
                </div>
            );

        case 'collection-grid':
        case 'product-grid':
            return (
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">{settings.sectionTitle || 'Collection'}</h3>
                    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${settings.columns || 4}, 1fr)` }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            );

        case 'promo-banner':
            return (
                <div className="flex items-center p-6 bg-gray-50">
                    <div className="w-1/2 aspect-video bg-gray-200 rounded-lg"></div>
                    <div className="w-1/2 p-6">
                        <span className="text-xs font-bold text-orange-500">{settings.badge}</span>
                        <h3 className="text-2xl font-bold mt-2">{settings.title || 'Promo Title'}</h3>
                        <p className="text-gray-600 mt-2">{settings.description}</p>
                        <button className="mt-4 px-4 py-2 bg-black text-white rounded">
                            {settings.ctaText || 'Learn More'}
                        </button>
                    </div>
                </div>
            );

        case 'text-block':
            return (
                <div className="p-8 text-center">
                    <p className="text-gray-600">{settings.content || 'Text content goes here...'}</p>
                </div>
            );

        case 'newsletter':
            return (
                <div className="p-8 bg-gray-900 text-white text-center">
                    <h3 className="text-xl font-bold">{settings.sectionTitle || 'Newsletter'}</h3>
                    <p className="text-gray-400 mt-2 mb-4">{settings.description}</p>
                    <div className="flex max-w-md mx-auto gap-2">
                        <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded text-black" />
                        <button className="px-4 py-2 bg-white text-black rounded">Subscribe</button>
                    </div>
                </div>
            );

        default:
            return (
                <div className="p-8 bg-gray-100 text-center text-gray-500">
                    <p>{getSectionLabel(sectionType)}</p>
                </div>
            );
    }

    function getSectionLabel(type: string) {
        return SECTION_TYPES.find(s => s.type === type)?.label || type;
    }
}

// Section Settings Component
function SectionSettings({ section, onUpdate }: { section: Section; onUpdate: (key: string, value: any) => void }) {
    const { sectionType, settings } = section;

    const renderField = (key: string, label: string, type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'range', options?: any) => {
        const value = settings[key] || '';

        switch (type) {
            case 'textarea':
                return (
                    <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <textarea
                            value={value}
                            onChange={(e) => onUpdate(key, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                );
            case 'number':
                return (
                    <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => onUpdate(key, parseInt(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            {...options}
                        />
                    </div>
                );
            case 'color':
                return (
                    <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={value || '#000000'}
                                onChange={(e) => onUpdate(key, e.target.value)}
                                className="w-12 h-10 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onUpdate(key, e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                );
            case 'range':
                return (
                    <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {label}: {Math.round((value || 0) * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={value || 0}
                            onChange={(e) => onUpdate(key, parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                );
            case 'select':
                return (
                    <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <select
                            value={value}
                            onChange={(e) => onUpdate(key, e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        >
                            {options.map((opt: { value: string; label: string }) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                );
            default:
                return (
                    <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onUpdate(key, e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                );
        }
    };

    // Render different settings based on section type
    switch (sectionType) {
        case 'hero-banner':
        case 'hero-video':
            return (
                <div>
                    {renderField('heading', 'Heading', 'text')}
                    {renderField('subheading', 'Subheading', 'text')}
                    {renderField('buttonText', 'Button Text', 'text')}
                    {renderField('buttonLink', 'Button Link', 'text')}
                    {sectionType === 'hero-banner' && renderField('backgroundImage', 'Background Image URL', 'text')}
                    {sectionType === 'hero-video' && renderField('backgroundVideo', 'Background Video URL', 'text')}
                    {renderField('overlayOpacity', 'Overlay Opacity', 'range')}
                    {renderField('textColor', 'Text Color', 'color')}
                    {renderField('alignment', 'Alignment', 'select', [
                        { value: 'left', label: 'Left' },
                        { value: 'center', label: 'Center' },
                        { value: 'right', label: 'Right' }
                    ])}
                </div>
            );

        case 'collection-grid':
        case 'product-grid':
            return (
                <div>
                    {renderField('sectionTitle', 'Section Title', 'text')}
                    {renderField('columns', 'Columns', 'number', { min: 2, max: 6 })}
                    {sectionType === 'product-grid' && renderField('rows', 'Rows', 'number', { min: 1, max: 4 })}
                </div>
            );

        case 'promo-banner':
            return (
                <div>
                    {renderField('badge', 'Badge Text', 'text')}
                    {renderField('title', 'Title', 'text')}
                    {renderField('description', 'Description', 'textarea')}
                    {renderField('image', 'Image URL', 'text')}
                    {renderField('ctaText', 'Button Text', 'text')}
                    {renderField('ctaLink', 'Button Link', 'text')}
                    {renderField('layout', 'Layout', 'select', [
                        { value: 'image-left', label: 'Image Left' },
                        { value: 'image-right', label: 'Image Right' }
                    ])}
                </div>
            );

        case 'text-block':
            return (
                <div>
                    {renderField('content', 'Content', 'textarea')}
                    {renderField('padding', 'Padding', 'select', [
                        { value: 'small', label: 'Small' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'large', label: 'Large' }
                    ])}
                </div>
            );

        case 'newsletter':
            return (
                <div>
                    {renderField('sectionTitle', 'Title', 'text')}
                    {renderField('description', 'Description', 'textarea')}
                </div>
            );

        default:
            return (
                <div className="text-gray-500 text-center py-4">
                    Settings for this section type coming soon
                </div>
            );
    }
}
