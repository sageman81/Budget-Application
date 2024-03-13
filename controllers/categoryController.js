// const express = require('express');
// const router = express.Router();
// const Category = require('../models/category'); // Ensure this path matches your project structure

// // Display all categories
// router.get('/', async (req, res) => {
//     try {
//         const categories = await Category.find({});
//         res.render('categories/index', { categories }); // Make sure this path matches your view file for listing categories
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         res.status(500).send("Error loading categories");
//     }
// });

// // Display form for adding a new category
// router.get('/new', (req, res) => {
//     res.render('categories/new'); // Path to your EJS file for adding a new category
// });

// // Create a new category
// // router.post('/', async (req, res) => {
// //     try {
// //         const { name } = req.body;
// //         await Category.create({ name });
// //         res.redirect('/categories'); // Adjust as needed, possibly to show all categories
// //     } catch (error) {
// //         console.error('Error creating category:', error);
// //         // Handle duplicate category name error specifically if needed
// //         res.status(500).send("Error creating category");
// //     }
// // });
// // Route to handle the creation of a new category
// router.post('/', async (req, res) => {
//     try {
//         const { name } = req.body;
//         // Check if a category with the same name already exists
//         const existingCategory = await Category.findOne({ name: name });
//         if (existingCategory) {
//             // Handle the case where the category already exists
//             // For example, you might want to send a message back to the form
//             return res.status(400).send('A category with this name already exists. Please choose a different name.');
//         }
        
//         // If the category doesn't exist, create a new one
//         const newCategory = new Category({ name });
//         await newCategory.save();
//         res.redirect('/categories'); // Or wherever you'd like the user to go after adding a category
//     } catch (error) {
//         console.error('Error creating category:', error);
//         res.status(500).send("Error creating category");
//     }
// });


// // Display form for editing an existing category
// router.get('/edit/:id', async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id);
//         if (!category) {
//             return res.status(404).send('Category not found');
//         }
//         res.render('categories/edit', { category }); // Path to your EJS file for editing a category
//     } catch (error) {
//         console.error("Error finding category:", error);
//         res.status(500).send("Error loading edit form");
//     }
// });

// // Update a category
// router.put('/edit/:id', async (req, res) => {
//     try {
//         const { name } = req.body;
//         await Category.findByIdAndUpdate(req.params.id, { name });
//         res.redirect('/categories');
//     } catch (error) {
//         console.error("Error updating category:", error);
//         res.status(500).send("Error updating category");
//     }
// });

// // Delete a category
// router.get('/delete/:id', async (req, res) => {
//     try {
//         await Category.findByIdAndRemove(req.params.id);
//         res.redirect('/categories');
//     } catch (error) {
//         console.error("Error deleting category:", error);
//         res.status(500).send("Error deleting category");
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Category = require('../models/category'); // Ensure this path matches your project structure

// Index - Show all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.session.userId });
        res.render('categories/index', { categories }); // Adjust path as necessary
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Error loading categories");
    }
});

// New - Show form to create new category
router.get('/new', (req, res) => {
    res.render('categories/new'); // Adjust path as necessary
});

// Create - Add new category to DB
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const existingCategory = await Category.findOne({ name: name, userId: req.session.userId });
        if (existingCategory) {
            return res.status(400).send('A category with this name already exists.');
        }
        await Category.create({ name, userId: req.session.userId });
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send("Error creating category");
    }
});

// Show - Show more info about one category
// Note: This route might not be typically used for categories unless each category has additional details to display
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render('categories/show', { category }); // You might need to create this view
    } catch (error) {
        console.error("Error finding category:", error);
        res.status(404).send("Category not found");
    }
});

// Edit - Show edit form for one category
router.get('/:id/edit', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render('categories/edit', { category }); // Adjust path as necessary
    } catch (error) {
        console.error("Error finding category:", error);
        res.status(404).send("Category not found");
    }
});

// Update - Update a particular category, then redirect somewhere
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        await Category.findByIdAndUpdate(req.params.id, { name });
        res.redirect('/categories');
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Error updating category");
    }
});

// Delete - Delete a particular category, then redirect somewhere
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Error deleting category");
    }
});

module.exports = router;

