const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true, runValidators: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add address
router.post('/me/addresses', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        user.addresses.push(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update address
router.put('/me/addresses/:addressId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const address = user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        Object.assign(address, req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete address
router.delete('/me/addresses/:addressId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        user.addresses.id(req.params.addressId).remove();
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get wishlist
router.get('/me/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add to wishlist
router.post('/me/wishlist/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user.wishlist.includes(req.params.productId)) {
            user.wishlist.push(req.params.productId);
            await user.save();
        }
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove from wishlist
router.delete('/me/wishlist/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .sort('-createdAt')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user stats (admin only)
router.get('/:id/stats', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id });
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;

        res.json({
            totalOrders,
            totalSpent,
            averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
