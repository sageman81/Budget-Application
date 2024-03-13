const express = require('express');
const router = express.Router();
const Category = require('../models/category'); // Ensure this path matches your project structure

// Display all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('categories/index', { categories }); // Make sure this path matches your view file for listing categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Error loading categories");
    }
});

// Display form for adding a new category
router.get('/new', (req, res) => {
    res.render('categories/new'); // Path to your EJS file for adding a new category
});

// Create a new category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        await Category.create({ name });
        res.redirect('/categories'); // Adjust as needed, possibly to show all categories
    } catch (error) {
        console.error('Error creating category:', error);
        // Handle duplicate category name error specifically if needed
        res.status(500).send("Error creating category");
    }
});

// Display form for editing an existing category
router.get('/edit/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.render('categories/edit', { category }); // Path to your EJS file for editing a category
    } catch (error) {
        console.error("Error finding category:", error);
        res.status(500).send("Error loading edit form");
    }
});

// Update a category
router.post('/edit/:id', async (req, res) => {
    try {
        const { name } = req.body;
        await Category.findByIdAndUpdate(req.params.id, { name });
        res.redirect('/categories');
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Error updating category");
    }
});

// Delete a category
router.get('/delete/:id', async (req, res) => {
    try {
        await Category.findByIdAndRemove(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Error deleting category");
    }
});

module.exports = router;
