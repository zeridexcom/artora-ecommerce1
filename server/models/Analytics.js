const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    // Date for aggregation
    date: {
        type: Date,
        required: true,
        index: true
    },

    // Traffic metrics
    traffic: {
        pageViews: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        bounceRate: { type: Number, default: 0 },
        avgSessionDuration: { type: Number, default: 0 }
    },

    // Sales metrics
    sales: {
        totalRevenue: { type: Number, default: 0 },
        orderCount: { type: Number, default: 0 },
        averageOrderValue: { type: Number, default: 0 },
        itemsSold: { type: Number, default: 0 }
    },

    // Product performance
    topProducts: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: String,
        views: { type: Number, default: 0 },
        addedToCart: { type: Number, default: 0 },
        purchased: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 }
    }],

    // Category performance
    topCategories: [{
        category: String,
        views: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 }
    }],

    // Customer metrics
    customers: {
        newCustomers: { type: Number, default: 0 },
        returningCustomers: { type: Number, default: 0 },
        totalSignups: { type: Number, default: 0 }
    },

    // Cart metrics
    cart: {
        addToCartCount: { type: Number, default: 0 },
        cartAbandonment: { type: Number, default: 0 },
        checkoutStarts: { type: Number, default: 0 },
        checkoutCompletions: { type: Number, default: 0 }
    }

}, { timestamps: true });

// Get or create today's analytics
analyticsSchema.statics.getToday = async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await this.findOne({ date: today });
    if (!analytics) {
        analytics = await this.create({ date: today });
    }
    return analytics;
};

// Get analytics for date range
analyticsSchema.statics.getRange = async function (startDate, endDate) {
    return this.find({
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
};

// Increment a metric
analyticsSchema.statics.increment = async function (metric, value = 1) {
    const today = await this.getToday();
    const update = {};
    update[metric] = value;
    return this.findByIdAndUpdate(today._id, { $inc: update }, { new: true });
};

module.exports = mongoose.model('Analytics', analyticsSchema);
