const express = require('express');
const router = express.Router();
const PageTemplate = require('../models/PageTemplate');
const { auth, adminAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all page templates (admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const pages = await PageTemplate.find().select('pageId pageName isPublished updatedAt');
        res.json(pages);
    } catch (error) {
        console.error('Get pages error:', error);
        res.status(500).json({ error: 'Failed to get pages' });
    }
});

// Get specific page template
router.get('/:pageId', async (req, res) => {
    try {
        const page = await PageTemplate.getPage(req.params.pageId);
        res.json(page);
    } catch (error) {
        console.error('Get page error:', error);
        res.status(500).json({ error: 'Failed to get page' });
    }
});

// Update page template (admin only)
router.put('/:pageId', adminAuth, async (req, res) => {
    try {
        const { pageId } = req.params;
        const { pageName, seo, sections } = req.body;

        let page = await PageTemplate.findOne({ pageId });
        if (!page) {
            page = new PageTemplate({ pageId, pageName: pageName || pageId });
        }

        if (pageName) page.pageName = pageName;
        if (seo) page.seo = seo;
        if (sections) page.sections = sections;

        await page.save();
        res.json(page);
    } catch (error) {
        console.error('Update page error:', error);
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// Add section to page (admin only)
router.post('/:pageId/sections', adminAuth, async (req, res) => {
    try {
        const { pageId } = req.params;
        const { sectionType, settings, order } = req.body;

        let page = await PageTemplate.getPage(pageId);

        const newSection = {
            sectionId: uuidv4(),
            sectionType,
            order: order !== undefined ? order : page.sections.length,
            visible: true,
            settings: settings || {}
        };

        page.sections.push(newSection);
        page.sections.sort((a, b) => a.order - b.order);

        await page.save();
        res.json(page);
    } catch (error) {
        console.error('Add section error:', error);
        res.status(500).json({ error: 'Failed to add section' });
    }
});

// Update section (admin only)
router.put('/:pageId/sections/:sectionId', adminAuth, async (req, res) => {
    try {
        const { pageId, sectionId } = req.params;
        const updates = req.body;

        let page = await PageTemplate.findOne({ pageId });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const sectionIndex = page.sections.findIndex(s => s.sectionId === sectionId);
        if (sectionIndex === -1) {
            return res.status(404).json({ error: 'Section not found' });
        }

        // Update section properties
        Object.keys(updates).forEach(key => {
            if (key === 'settings') {
                page.sections[sectionIndex].settings = {
                    ...page.sections[sectionIndex].settings,
                    ...updates.settings
                };
            } else {
                page.sections[sectionIndex][key] = updates[key];
            }
        });

        await page.save();
        res.json(page);
    } catch (error) {
        console.error('Update section error:', error);
        res.status(500).json({ error: 'Failed to update section' });
    }
});

// Delete section (admin only)
router.delete('/:pageId/sections/:sectionId', adminAuth, async (req, res) => {
    try {
        const { pageId, sectionId } = req.params;

        let page = await PageTemplate.findOne({ pageId });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        page.sections = page.sections.filter(s => s.sectionId !== sectionId);

        // Reorder remaining sections
        page.sections.forEach((section, index) => {
            section.order = index;
        });

        await page.save();
        res.json(page);
    } catch (error) {
        console.error('Delete section error:', error);
        res.status(500).json({ error: 'Failed to delete section' });
    }
});

// Reorder sections (admin only)
router.post('/:pageId/reorder', adminAuth, async (req, res) => {
    try {
        const { pageId } = req.params;
        const { sectionOrder } = req.body; // Array of sectionIds in new order

        let page = await PageTemplate.findOne({ pageId });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        // Create a map for quick lookup
        const sectionMap = new Map();
        page.sections.forEach(section => {
            sectionMap.set(section.sectionId, section);
        });

        // Reorder based on provided order
        const reorderedSections = sectionOrder
            .map((id, index) => {
                const section = sectionMap.get(id);
                if (section) {
                    section.order = index;
                    return section;
                }
                return null;
            })
            .filter(s => s !== null);

        page.sections = reorderedSections;
        await page.save();
        res.json(page);
    } catch (error) {
        console.error('Reorder sections error:', error);
        res.status(500).json({ error: 'Failed to reorder sections' });
    }
});

// Publish page (admin only)
router.post('/:pageId/publish', adminAuth, async (req, res) => {
    try {
        const { pageId } = req.params;

        let page = await PageTemplate.findOne({ pageId });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        page.isPublished = true;
        page.publishedAt = new Date();

        await page.save();
        res.json({ success: true, message: 'Page published successfully' });
    } catch (error) {
        console.error('Publish page error:', error);
        res.status(500).json({ error: 'Failed to publish page' });
    }
});

module.exports = router;
