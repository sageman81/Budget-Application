require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./Transaction'); // Adjust path as necessary
const mongodbURI = process.env.MONGODBURI;

mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedTransactions = [
  {
    name: 'Salary', // Align with your Transaction model fields
    amount: 3000,
    date: new Date(),
    category: 'Salary',
  },
  {
    name: 'Grocery Shopping',
    amount: -150,
    date: new Date(),
    category: 'Groceries',
  }
];

const db = mongoose.connection;

db.on('open', async () => {
    try {
        await Transaction.deleteMany({});
        await Transaction.insertMany(seedTransactions);
        console.log("Database seeded successfully.");
        process.exit();
    } catch (error) {
        console.error("Error seeding the database:", error);
        process.exit(1);
    }
});
