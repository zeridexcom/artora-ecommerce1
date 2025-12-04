const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    // Branding
    siteName: {
        type: String,
        default: 'Lazywalls'
    },
    tagline: {
        type: String,
        default: 'Premium Wall Posters & Stickers'
    },
    logo: {
        url: String,
        alt: String
    },
    favicon: String,

    // Colors
    colors: {
        primary: { type: String, default: '#000000' },
        secondary: { type: String, default: '#ffffff' },
        accent: { type: String, default: '#ff6b00' },
        background: { type: String, default: '#ffffff' },
        text: { type: String, default: '#1a1a1a' }
    },

    // Typography
    fonts: {
        heading: { type: String, default: 'Inter' },
        body: { type: String, default: 'Inter' }
    },

    // Contact Info
    contact: {
        email: String,
        phone: String,
        address: String
    },

    // Social Links
    social: {
        facebook: String,
        instagram: String,
        twitter: String,
        pinterest: String,
        youtube: String
    },

    // SEO Defaults
    seo: {
        metaTitle: { type: String, default: 'Lazywalls - Premium Wall Posters & Stickers' },
        metaDescription: { type: String, default: 'Transform your space with premium wall posters and stickers from Lazywalls.' },
        keywords: [String],
        ogImage: String
    },

    // Footer
    footer: {
        copyrightText: { type: String, default: '© 2024 Lazywalls. All rights reserved.' },
        showNewsletter: { type: Boolean, default: true },
        columns: [{
            title: String,
            links: [{
                label: String,
                url: String
            }]
        }]
    },

    // Header
    header: {
        showTopBar: { type: Boolean, default: true },
        topBarText: String,
        menuItems: [{
            label: String,
            url: String,
            children: [{
                label: String,
                url: String
            }]
        }]
    },

    // Store Settings
    store: {
        currency: { type: String, default: 'INR' },
        currencySymbol: { type: String, default: '₹' },
        taxRate: { type: Number, default: 18 },
        freeShippingThreshold: { type: Number, default: 999 },
        shippingCost: { type: Number, default: 99 }
    },

    // Feature Flags
    features: {
        enableWishlist: { type: Boolean, default: true },
        enableReviews: { type: Boolean, default: true },
        enableQuickView: { type: Boolean, default: true },
        enableCompare: { type: Boolean, default: false },
        maintenanceMode: { type: Boolean, default: false }
    }

}, { timestamps: true });

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
