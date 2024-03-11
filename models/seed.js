// models/seed.js
require('dotenv').config();
const { connectDB, User, Transaction } = require('.');
const mongoose = require('mongoose');

connectDB();

const seedDB = async () => {
    await User.deleteMany({});
    await Transaction.deleteMany({});

    const user = await User.create({
        username: 'demoUser',
        password: 'password123',
    });

    await Transaction.create([
        { name: 'Salary', amount: 5000, category: 'Income', user: user._id },
        { name: 'Rent', amount: -1500, category: 'Expense', user: user._id },
        { name: 'Groceries', amount: -300, category: 'Expense', user: user._id },
    ]);

    console.log('Database seeded successfully!');
};

seedDB().then(() => {
    mongoose.connection.close();
});
