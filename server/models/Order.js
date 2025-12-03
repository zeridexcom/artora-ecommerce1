const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        image: String,
    }],
    shippingAddress: {
        firstName: String,
        lastName: String,
        company: String,
        address1: String,
        address2: String,
        city: String,
        province: String,
        country: String,
        zip: String,
        phone: String,
    },
    billingAddress: {
        firstName: String,
        lastName: String,
        company: String,
        address1: String,
        address2: String,
        city: String,
        province: String,
        country: String,
        zip: String,
        phone: String,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    shipping: {
        type: Number,
        default: 0,
    },
    tax: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['stripe', 'paypal', 'cash'],
        default: 'stripe',
    },
    paymentIntentId: String,
    trackingNumber: String,
    notes: String,
    customerNote: String,
}, {
    timestamps: true,
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
