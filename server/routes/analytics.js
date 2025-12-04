const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

// Get dashboard overview (admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        // Get date range (default: last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Get analytics data
        const analyticsData = await Analytics.getRange(startDate, endDate);

        // Get real-time stats
        const [
            totalRevenue,
            totalOrders,
            totalProducts,
            totalCustomers,
            recentOrders,
            topProducts,
            lowStockProducts
        ] = await Promise.all([
            // Total revenue
            Order.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Total orders
            Order.countDocuments(),
            // Total products
            Product.countDocuments({ active: true }),
            // Total customers
            User.countDocuments({ role: 'customer' }),
            // Recent orders
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name email'),
            // Top products by sales
            Order.aggregate([
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.product',
                        name: { $first: '$items.name' },
                        totalSold: { $sum: '$items.quantity' },
                        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 }
            ]),
            // Low stock products
            Product.find({ quantity: { $lte: 10 }, active: true })
                .select('name quantity images')
                .limit(10)
        ]);

        res.json({
            overview: {
                totalRevenue: totalRevenue[0]?.total || 0,
                totalOrders,
                totalProducts,
                totalCustomers
            },
            recentOrders,
            topProducts,
            lowStockProducts,
            chartData: analyticsData
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to get dashboard data' });
    }
});

// Get sales analytics (admin only)
router.get('/sales', adminAuth, async (req, res) => {
    try {
        const { period = '30d' } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        const salesData = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                    items: { $sum: { $size: '$items' } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Calculate summary
        const summary = salesData.reduce((acc, day) => {
            acc.totalRevenue += day.revenue;
            acc.totalOrders += day.orders;
            acc.totalItems += day.items;
            return acc;
        }, { totalRevenue: 0, totalOrders: 0, totalItems: 0 });

        summary.averageOrderValue = summary.totalOrders > 0
            ? summary.totalRevenue / summary.totalOrders
            : 0;

        res.json({ salesData, summary });
    } catch (error) {
        console.error('Sales analytics error:', error);
        res.status(500).json({ error: 'Failed to get sales data' });
    }
});

// Get product analytics (admin only)
router.get('/products', adminAuth, async (req, res) => {
    try {
        // Product performance
        const productStats = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 20 }
        ]);

        // Category breakdown
        const categoryStats = await Product.aggregate([
            { $match: { active: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    totalStock: { $sum: '$quantity' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Inventory status
        const inventoryStatus = await Product.aggregate([
            { $match: { active: true } },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    inStock: { $sum: { $cond: [{ $gt: ['$quantity', 10] }, 1, 0] } },
                    lowStock: { $sum: { $cond: [{ $and: [{ $lte: ['$quantity', 10] }, { $gt: ['$quantity', 0] }] }, 1, 0] } },
                    outOfStock: { $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] } }
                }
            }
        ]);

        res.json({
            topProducts: productStats,
            categoryBreakdown: categoryStats,
            inventoryStatus: inventoryStatus[0] || { totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0 }
        });
    } catch (error) {
        console.error('Product analytics error:', error);
        res.status(500).json({ error: 'Failed to get product analytics' });
    }
});

// Get customer analytics (admin only)
router.get('/customers', adminAuth, async (req, res) => {
    try {
        // Customer growth
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const customerGrowth = await User.aggregate([
            { $match: { role: 'customer', createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    newCustomers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top customers by order value
        const topCustomers = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$total' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    name: '$userInfo.name',
                    email: '$userInfo.email',
                    totalSpent: 1,
                    orderCount: 1
                }
            }
        ]);

        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const newThisMonth = await User.countDocuments({
            role: 'customer',
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            totalCustomers,
            newThisMonth,
            customerGrowth,
            topCustomers
        });
    } catch (error) {
        console.error('Customer analytics error:', error);
        res.status(500).json({ error: 'Failed to get customer analytics' });
    }
});

// Track page view (public)
router.post('/track/pageview', async (req, res) => {
    try {
        await Analytics.increment('traffic.pageViews');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track' });
    }
});

// Track add to cart (public)
router.post('/track/add-to-cart', async (req, res) => {
    try {
        await Analytics.increment('cart.addToCartCount');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track' });
    }
});

module.exports = router;
