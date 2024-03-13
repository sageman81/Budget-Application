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
const { User, Category, Transaction } = require('./models');


// Middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));


// Setting up EJS as the view engine
app.set('view engine', 'ejs');

//import controllers
const transactionsController = require('./controllers/transactionsController');
const sessionController = require('./controllers/sessionController');
//Sessions

//Use sessions authorization
app.use('/auth', sessionController);
// Use transactions controller
app.use('/transactions', transactionsController);

// Root route to welcome users
app.get('/', (req, res) => {
    if (req.session.userId) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/auth/login');
    }
  });

// Dashboard Route
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) {
      return res.redirect('/login');
  }

  try {
      // Fetch the user based on session userId
      const user = await User.findById(req.session.userId);
      
      // Fetch transactions associated with the user
      const transactions = await Transaction.find({ user: req.session.userId }).populate('category');
      
      // Pass both user and transactions to the dashboard view
      res.render('dashboard', { user, transactions });
  } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).send("Error loading the dashboard");
  }
});




// Login and registration routes 
// GET route for displaying the login form

//Route to signin
app.get('/signup', (req, res) => {
    res.render('users/newUser');
});

app.get('/login', (req, res) => {
    res.render('sessions/login'); 
});



app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id; // Establishes a session
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


// Display all categories
// app.get('/categories', async (req, res) => {
//     try {
//       const categories = await Category.find({});
//       res.render('categories/index', { categories }); // Assumes you have a view at /views/categories/index.ejs
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       res.status(500).send("Error loading categories");
//     }
//   });
  
//   // Display form for adding a new category
//   app.get('/categories/new', (req, res) => {
//     res.render('categories/new'); // Assumes you have a view for adding a new category
//   });
  
//   // Routes for editing and deleting categories
//   // Edit category form
//   app.get('/categories/edit/:id', async (req, res) => {
//     try {
//       const category = await Category.findById(req.params.id);
//       res.render('categories/edit', { category }); // Assumes you have a view for editing a category
//     } catch (error) {
//       console.error("Error finding category:", error);
//       res.status(500).send("Error loading edit form");
//     }
//   });
  
//   // Update a category
//   app.post('/categories', async (req, res) => {
//     const { name } = req.body;

//     // Attempt to find a category with the same name
//     const existingCategory = await Category.findOne({ name: name });
//     if (existingCategory) {
//         // A category with this name already exists, handle as needed
//         return res.status(400).send('A category with this name already exists.');
//     }

//     try {
//         // No existing category found, proceed with insertion
//         const newCategory = new Category({ name });
//         await newCategory.save();
//         res.redirect('/categories');
//     } catch (error) {
//         console.error("Error adding category:", error);
//         res.status(500).send("An error occurred while adding the category.");
//     }
// });

//   // Delete a category
//   app.get('/categories/delete/:id', async (req, res) => {
//     try {
//       await Category.findByIdAndRemove(req.params.id);
//       res.redirect('/categories');
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       res.status(500).send("Error deleting category");
//     }
//   });

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
