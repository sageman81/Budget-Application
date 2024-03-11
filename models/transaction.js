// models/transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: String,
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = mongoose.model('Transaction', transactionSchema);