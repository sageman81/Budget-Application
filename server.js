const express = require('express');
const app = express();
const PORT = 3000;
// Importing the Transaction model correctly from the models directory
const { Transaction } = require('./models/index');

// Middleware to parse JSON bodies
app.use(express.json());
// Setting up EJS as the view engine
app.set('view engine', 'ejs');

// Root route to welcome users
app.get('/', (req, res) => {
    res.send('Welcome to the Budget App!');
});

// A placeholder route for displaying transactions - you'll replace or update this
app.get('/budget', (req, res) => {
    res.send('Transactions placeholder');
});

app.get('/signup', (req, res) => {
    res.render('newUser'); // Renders views/newUser.ejs  
  });
  

// Route for creating a new transaction
app.post('/transactions', async (req, res) => {
    try {
        const transaction = new Transaction({
            name: req.body.name,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
        });

        const savedTransaction = await transaction.save();
        res.status(201).send(savedTransaction);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
