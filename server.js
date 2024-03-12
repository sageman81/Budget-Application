require('dotenv').config();
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const { Transaction, User, Category } = require('./models/index');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }
}));

// Setting up EJS as the view engine
app.set('view engine', 'ejs');



// Root route to welcome users
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

// Dashboard Route
app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const transactions = await Transaction.find({ user: req.session.userId });
        res.render('dashboard', { transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).send("Error loading the dashboard");
    }
});

// Login and registration routes 
// GET route for displaying the login form
app.get('/login', (req, res) => {
    res.render('sessions/login'); 
});



app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id; // Establishing a session
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send('Internal Server Error');
    }
});


// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error logging out:", err);
            return res.redirect('/dashboard');
        }
        res.redirect('/login');
    });
});

// Create New Transaction
// Create New Transaction
app.post('/transactions', async (req, res) => {
    let { name, amount, date, category } = req.body;
  
    try {
      // Check if the category is an ObjectId or a new category name
      if (!ObjectId.isValid(category)) {
        // Assume category is a new category name. Create a new category document.
        const newCategory = await Category.create({ name: category });
        category = newCategory._id;
      }
  
      const newTransaction = new Transaction({ name, amount, date, category, user: req.session.userId });
      await newTransaction.save();
      res.redirect('/dashboard');
    } catch (error) {
      console.error("Error saving transaction:", error);
      res.status(400).send('Error saving transaction');
    }
  });
  


// Edit Transaction View
app.get('/transactions/edit/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, user: req.session.userId }).populate('category');
        const categories = await Category.find({});

        console.log(categories); 
        

        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        res.render('transactions/edit', { transaction, categories });
    } catch (error) {
        console.error("Error fetching transaction or categories:", error);
        res.status(500).send('Error loading edit form');
    }
});




// Update Transaction
app.put('/transactions/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { id } = req.params;
        const { name, amount, date, category } = req.body;
        await Transaction.findOneAndUpdate({ _id: id, user: req.session.userId }, { name, amount, date, category }, { new: true });
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(400).send('Error updating transaction');
    }
});

// Delete Transaction
app.delete('/transactions/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { id } = req.params;
        await Transaction.findOneAndDelete({ _id: id, user: req.session.userId });
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(400).send('Error deleting transaction');
    }
});

// Display all categories
app.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find({});
      res.render('categories/index', { categories }); // Assumes you have a view at /views/categories/index.ejs
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).send("Error loading categories");
    }
  });
  

  // Display form for adding a new category
  app.get('/categories/new', (req, res) => {
    res.render('categories/new'); // Assumes you have a view for adding a new category
  });
  
  // Routes for editing and deleting categories
  // Edit category form
  app.get('/categories/edit/:id', async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.render('categories/edit', { category }); // Assumes you have a view for editing a category
    } catch (error) {
      console.error("Error finding category:", error);
      res.status(500).send("Error loading edit form");
    }
  });
  
  // Update a category
  app.post('/categories', async (req, res) => {
    const { name } = req.body;

    // Attempt to find a category with the same name
    const existingCategory = await Category.findOne({ name: name });
    if (existingCategory) {
        // A category with this name already exists, handle as needed
        return res.status(400).send('A category with this name already exists.');
    }

    try {
        // No existing category found, proceed with insertion
        const newCategory = new Category({ name });
        await newCategory.save();
        res.redirect('/categories');
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).send("An error occurred while adding the category.");
    }
});



  
  
  // Delete a category
  app.get('/categories/delete/:id', async (req, res) => {
    try {
      await Category.findByIdAndRemove(req.params.id);
      res.redirect('/categories');
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).send("Error deleting category");
    }
  });
  



// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
