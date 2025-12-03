const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    compareAtPrice: {
        type: Number,
        min: 0,
    },
    images: [{
        url: String,
        alt: String,
    }],
    category: {
        type: String,
        required: true,
        enum: ['modern', 'nature', 'abstract', 'classic', 'featured', 'trending', 'creative', 'whisper'],
    },
    tags: [String],
    inventory: {
        quantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 5,
        },
        trackInventory: {
            type: Boolean,
            default: true,
        },
    },
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
        unit: {
            type: String,
            enum: ['cm', 'in'],
            default: 'cm',
        },
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            enum: ['kg', 'lb'],
            default: 'kg',
        },
    },
    featured: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    seo: {
        title: String,
        description: String,
        keywords: [String],
    },
}, {
    timestamps: true,
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function () {
    return this.inventory.trackInventory &&
        this.inventory.quantity <= this.inventory.lowStockThreshold;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function () {
    return !this.inventory.trackInventory || this.inventory.quantity > 0;
});

// Method to reduce inventory
productSchema.methods.reduceInventory = async function (quantity) {
    if (this.inventory.trackInventory) {
        if (this.inventory.quantity < quantity) {
            throw new Error('Insufficient inventory');
        }
        this.inventory.quantity -= quantity;
        await this.save();
    }
};

// Method to increase inventory
productSchema.methods.increaseInventory = async function (quantity) {
    if (this.inventory.trackInventory) {
        this.inventory.quantity += quantity;
        await this.save();
    }
};

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
