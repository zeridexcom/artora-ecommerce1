const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .populate('items.product')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all orders (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product')
            .sort('-createdAt')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            orders,
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

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create order
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress, billingAddress, shipping, tax } = req.body;

        // Calculate totals and validate inventory
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.product} not found` });
            }

            if (!product.inStock) {
                return res.status(400).json({ error: `Product ${product.name} is out of stock` });
            }

            if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient inventory for ${product.name}. Available: ${product.inventory.quantity}`
                });
            }

            subtotal += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0]?.url || '',
            });
        }

        const total = subtotal + (shipping || 0) + (tax || 0);

        // Create order
        const order = new Order({
            user: req.user.userId,
            items: orderItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            subtotal,
            shipping: shipping || 0,
            tax: tax || 0,
            total,
        });

        await order.save();

        // Reduce inventory
        for (const item of items) {
            const product = await Product.findById(item.product);
            await product.reduceInventory(item.quantity);
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (status) order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel order
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if user owns this order
        if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Can only cancel pending or processing orders
        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({ error: 'Cannot cancel this order' });
        }

        order.status = 'cancelled';
        await order.save();

        // Restore inventory
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                await product.increaseInventory(item.quantity);
            }
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
