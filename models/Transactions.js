const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: String, // Assuming you want to keep 'name' based on the original file
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

