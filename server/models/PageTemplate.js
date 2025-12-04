const mongoose = require('mongoose');

const pageTemplateSchema = new mongoose.Schema({
    // Page identifier
    pageId: {
        type: String,
        required: true,
        unique: true,
        enum: ['home', 'about', 'contact', 'collection', 'product']
    },

    pageName: {
        type: String,
        required: true
    },

    // SEO for this page
    seo: {
        title: String,
        description: String,
        ogImage: String
    },

    // Sections array - the heart of the theme editor
    sections: [{
        sectionId: {
            type: String,
            required: true
        },
        sectionType: {
            type: String,
            required: true,
            enum: [
                'hero-banner',
                'hero-video',
                'collection-grid',
                'product-grid',
                'product-tabs',
                'promo-banner',
                'image-text',
                'text-block',
                'newsletter',
                'testimonials',
                'instagram-feed',
                'featured-products',
                'categories-showcase',
                'video-section',
                'faq-section',
                'custom-html'
            ]
        },
        order: {
            type: Number,
            required: true
        },
        visible: {
            type: Boolean,
            default: true
        },
        settings: {
            // Hero Banner
            heading: String,
            subheading: String,
            buttonText: String,
            buttonLink: String,
            backgroundImage: String,
            backgroundVideo: String,
            overlayOpacity: { type: Number, default: 0.3 },
            textColor: { type: String, default: '#ffffff' },
            alignment: { type: String, default: 'center' },

            // Collection/Product Grid
            columns: { type: Number, default: 4 },
            rows: { type: Number, default: 2 },
            showTitle: { type: Boolean, default: true },
            showPrice: { type: Boolean, default: true },
            showAddToCart: { type: Boolean, default: true },
            collectionId: String,
            productIds: [String],

            // Promo Banner
            badge: String,
            title: String,
            description: String,
            image: String,
            ctaText: String,
            ctaLink: String,
            backgroundColor: String,
            layout: { type: String, default: 'image-left' },

            // Text Block
            content: String,
            padding: { type: String, default: 'medium' },

            // Custom HTML
            htmlContent: String,

            // General
            sectionTitle: String,
            maxItems: { type: Number, default: 8 },
            autoplay: { type: Boolean, default: false },
            interval: { type: Number, default: 5000 }
        }
    }],

    // Published status
    isPublished: {
        type: Boolean,
        default: false
    },

    publishedAt: Date,

    // Draft version for preview
    draftSections: [mongoose.Schema.Types.Mixed]

}, { timestamps: true });

// Get page with sections
pageTemplateSchema.statics.getPage = async function (pageId) {
    let page = await this.findOne({ pageId });
    if (!page) {
        // Create default page
        page = await this.create({
            pageId,
            pageName: pageId.charAt(0).toUpperCase() + pageId.slice(1),
            sections: []
        });
    }
    return page;
};

module.exports = mongoose.model('PageTemplate', pageTemplateSchema);
