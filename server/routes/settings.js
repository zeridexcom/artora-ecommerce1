const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { auth, adminAuth } = require('../middleware/auth');

// Get site settings (public - for frontend to use)
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
});

// Update site settings (admin only)
router.put('/', adminAuth, async (req, res) => {
    try {
        let settings = await SiteSettings.getSettings();

        // Update fields
        const allowedFields = [
            'siteName', 'tagline', 'logo', 'favicon',
            'colors', 'fonts', 'contact', 'social',
            'seo', 'footer', 'header', 'store', 'features'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });

        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Update specific section (admin only)
router.patch('/:section', adminAuth, async (req, res) => {
    try {
        const { section } = req.params;
        let settings = await SiteSettings.getSettings();

        if (settings[section] !== undefined) {
            settings[section] = { ...settings[section], ...req.body };
            await settings.save();
            res.json(settings);
        } else {
            res.status(400).json({ error: 'Invalid section' });
        }
    } catch (error) {
        console.error('Patch settings error:', error);
        res.status(500).json({ error: 'Failed to update section' });
    }
});

// Upload logo (admin only)
router.post('/logo', adminAuth, async (req, res) => {
    try {
        const { url, alt } = req.body;
        let settings = await SiteSettings.getSettings();
        settings.logo = { url, alt };
        await settings.save();
        res.json({ success: true, logo: settings.logo });
    } catch (error) {
        console.error('Logo upload error:', error);
        res.status(500).json({ error: 'Failed to upload logo' });
    }
});

module.exports = router;
