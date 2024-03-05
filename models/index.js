require('dotenv').config();
const mongoose = require('mongoose');
const mongodbURI = process.env.MONGODBURI; // Ensure this matches your .env file's variable name

// Use the variable you defined above to keep consistency
mongoose.connect(mongodbURI, {}).then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

const db = mongoose.connection;

db.on('connected', () => {
    console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.error(`MongoDB connection error: ${error}`);
});

module.exports = {
    Transaction: require('./transactions') // Adjust if you have other models
};

