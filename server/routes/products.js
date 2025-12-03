const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

// Get all products with filtering
router.get('/', async (req, res) => {
    try {
        const {
            category,
            collection,
            search,
            minPrice,
            maxPrice,
            featured,
            limit = 20,
            page = 1,
            sort = '-createdAt'
        } = req.query;

        const query = { active: true };

        if (category) query.category = category;
        if (collection) query.category = collection;
        if (featured) query.featured = true;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
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

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create product (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update inventory (admin only)
router.patch('/:id/inventory', adminAuth, async (req, res) => {
    try {
        const { quantity, operation } = req.body; // operation: 'set', 'increase', 'decrease'
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (operation === 'set') {
            product.inventory.quantity = quantity;
        } else if (operation === 'increase') {
            await product.increaseInventory(quantity);
        } else if (operation === 'decrease') {
            await product.reduceInventory(quantity);
        }

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
