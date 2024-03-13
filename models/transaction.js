// models/transaction.js
const mongoose = require('mongoose');



const transactionSchema = new mongoose.Schema({
    description: { type: String, required: true }, 
    amount: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
});


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;





