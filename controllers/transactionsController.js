const express = require('express');
const router = express.Router();
const { Transaction, Category } = require('../models');
const mongoose = require('mongoose');

// Index
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.session.currentUser._id }).populate('category');
    console.log(JSON.stringify(transactions, null, 2)); // For debugging purposes
    
    res.render('transactions/index', { transactions }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving transactions");
  }
});

// New Route
router.get('/new', async (req, res) => {
  const categories = await Category.find({});
  res.render('transactions/new', { categories });
});

// Handle form submission for a new transaction
router.post('/', async (req, res) => {
  console.log("Received transaction data:", req.body);
  const { description, amount, category, date } = req.body;
  try {
    const newTransaction = await Transaction.create({
      description,
      amount,
      category,
      date,
      user: req.session.currentUser._id, // Associate transaction with current user
    });
    res.redirect('/transactions');
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Show Route
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('category');
    // Verify the transaction belongs to the current user
    if (!transaction || transaction.user.toString() !== req.session.currentUser._id.toString()) {
      return res.status(404).send("Transaction not found");
    }
    res.render('transactions/show', { transaction }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Error finding transaction");
  }
});

// Edit Route
router.get('/:id/edit', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    const categories = await Category.find({}); // Fetch all categories
    // Verify the transaction belongs to the current user
    if (!transaction || transaction.user.toString() !== req.session.currentUser._id.toString()) {
      return res.status(404).send("Transaction not found");
    }
    res.render('transactions/edit', { transaction, categories }); // Pass both transaction and categories to the view
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
});

router.put('/:id', async (req, res) => {
  const { description, amount, category, date } = req.body;
  try {
    // Update the transaction if it belongs to the current user
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.session.currentUser._id.toString()) {
      return res.status(404).send("Transaction not found");
    }
    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, {
      description,
      amount,
      category,
      date
    }, { new: true });

    res.redirect(`/transactions/${updatedTransaction._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating transaction");
  }
});

// Delete Route
router.delete('/:id', async (req, res) => {
  try {
    // Delete the transaction if it belongs to the current user
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.session.currentUser._id.toString()) {
      return res.status(404).send("Transaction not found");
    }
    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect('/transactions');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting transaction");
  }
});

module.exports = router;
