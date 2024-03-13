const express = require('express');
const router = express.Router();
const { Transaction, Category, User } = require('../models'); 
const mongoose =require('mongoose');


//Index
router.get('/', async (req, res) => {
  try {
      const transactions = await Transaction.find({ user: req.session.userId }).populate('category');
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
          user: req.session.userId,
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
      const transaction = await Transaction.findOne({ _id: req.params.id });
      res.render('transactions/show', { transaction }); // Adjust the path to your views if necessary
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
      res.render('transactions/edit', { transaction, categories }); // Pass both transaction and categories to the view
  } catch (error) {
      console.error(error);
      res.status(500).send("Error loading edit form");
  }
});



// Update Route
router.put('/:id', async (req, res) => {
  try {
      await Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
      res.redirect(`/transactions/${req.params.id}`);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error updating transaction");
  }
});


// Delete Route

router.delete('/:id', async (req, res) => {
  try {
      await Transaction.findByIdAndDelete(req.params.id);
      res.redirect('/transactions');
  } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting transaction");
  }
});



module.exports = router;
