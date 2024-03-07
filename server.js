const express = require('express');
const session = require('express-session'); // Ensure this is required for session management
const app = express();
const PORT = 3000;

// Importing the Transaction model correctly from the models directory
const { Transaction } = require('./models/index');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting up EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));


// Configure session middleware before any route that requires session data
app.use(session({
    secret: 'your_secret_key', // Use a real secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true } // Set secure to true if using https (Consider environment-based logic)
}));

// Include your session controller after session middleware setup
const sessionController = require('./controllers/sessionController');
app.use('/', sessionController); 

// Root route to welcome users
app.get('/', (req, res) => {
    res.render('budget-home');
});


// Route to render the sign-up form
app.get('/signup', (req, res) => {
    res.render('users/newUser'); // Assumes newUser.ejs is located directly under the views directory
});

// app.get('/dashboard', (req, res) => {
//     if (req.session.userId) { // Assuming you set this session variable upon login
//         res.render('dashboard', { currentUser: req.session });
//     } else {
//         res.redirect('/login');
//     }
// });

// Example of formatting for the dashboard route handler in server.js or routes/dashboardRoutes.js
app.get('/dashboard', async (req, res) => {
    try {
        // Example of fetching transactions from the database
        const transactions = await Transaction.find({ user: req.session.userId });
        res.render('dashboard', { transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).render('dashboard', { error: "Failed to load transactions." });
    }
});



// Route for handling user registration
app.post('/users', async (req, res) => {
    try {
      const { username, password } = req.body;
      // Hash the password and save the new user to the database here
      // Redirect to a login page, or possibly auto-login the user and redirect to their dashboard
      res.redirect('/login'); // Ensure you have a route handling '/login'
    } catch (error) {
      res.status(500).send('Server error');
    }
});

// Placeholder route for displaying transactions - you'll update this as needed
app.get('/budget', (req, res) => {
    res.send('Transactions placeholder');
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

