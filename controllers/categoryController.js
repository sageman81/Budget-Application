const express = require('express');
const router = express.Router();
const Category = require('../models/category'); 

// Index - Show all categories
router.get('/', async (req, res) => {
    try {
        // Only fetch categories associated with the logged-in user
        const categories = await Category.find({ userId: req.session.currentUser._id });
        res.render('categories/index', { categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Error loading categories");
    }
});

// New - Show form to create a new category
router.get('/new', (req, res) => {
    res.render('categories/new'); 
});

// Create - Add new category to DB
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        // Check if the category already exists for this user
        const existingCategory = await Category.findOne({ name: name, userId: req.session.currentUser._id });
        if (existingCategory) {
            return res.status(400).send('A category with this name already exists for your account.');
        }
        // Create the category and associate it with the user
        await Category.create({ name, userId: req.session.currentUser._id });
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send("Error creating category");
    }
});

// Show - Show info about one category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        // Make sure the category belongs to the current user
        if (!category || category.userId.toString() !== req.session.currentUser._id.toString()) {
            return res.status(404).send("Category not found");
        }
        res.render('categories/show', { category }); 
    } catch (error) {
        console.error("Error finding category:", error);
        res.status(404).send("Category not found");
    }
});

// Edit - Show edit form for one category
router.get('/:id/edit', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        // Make sure the category belongs to the current user
        if (!category || category.userId.toString() !== req.session.currentUser._id.toString()) {
            return res.status(404).send("Category not found");
        }
        res.render('categories/edit', { category }); 
    } catch (error) {
        console.error("Error finding category:", error);
        res.status(404).send("Category not found");
    }
});

// Update - Update a category, then redirect
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findById(req.params.id);
        // Make sure the category belongs to the current user before updating
        if (!category || category.userId.toString() !== req.session.currentUser._id.toString()) {
            return res.status(404).send("Category not found");
        }
        await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
        res.redirect('/categories');
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Error updating category");
    }
});

// Delete - Delete a category, then redirect
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        // Make sure the category belongs to the current user before deleting
        if (!category || category.userId.toString() !== req.session.currentUser._id.toString()) {
            return res.status(404).send("Category not found");
        }
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Error deleting category");
    }
});

module.exports = router;


