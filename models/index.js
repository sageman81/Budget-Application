// models/index.js
const mongoose = require('mongoose');
const User = require('./user');
const Transaction = require('./transaction'); 

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
};

module.exports = {
    connectDB,
    User,
    Transaction,
};


