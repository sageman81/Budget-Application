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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
//    cookie: {
//     secure: process.env.NODE_ENV === "production",
//      maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
//  }
}));

app.use((req, res, next) => {
  res.locals.title = "Budget App"; 
  if (req.session.currentUser) {
    res.locals.currentUser = req.session.currentUser; // Reflect currentUser in local variables for views
  }
  next();
});

// Setting up EJS as the view engine
app.set('view engine', 'ejs');

// Fetch user from database 
// Use async middleware to refresh currentUser if present
// app.use(async (req, res, next) => {
//   if (req.session.currentUser) {
//       try {
//           const user = await User.findById(req.session.currentUser._id);
//           if (user) {
//               res.locals.currentUser = user; // Update currentUser in local variables for views
//           } else {
//               delete req.session.currentUser; // Remove invalid currentUser session
//           }
//       } catch (error) {
//           console.error('Error fetching user from database', error);
//       }
//   }
//   next();
// });

// Import controllers
const transactionsController = require('./controllers/transactionsController');
const sessionController = require('./controllers/sessionController');
const categoryController = require('./controllers/categoryController');

// Use controllers 
app.use('/auth', sessionController);
app.use('/transactions', transactionsController);
app.use('/categories', categoryController); 

app.get('/', (req, res) => {
  if (req.session.currentUser) {
    res.redirect('/dashboard');
  } else {
    res.render('users/budget-home'); 
  }
});

// Dashboard Route
app.get('/dashboard', async (req, res) => {
  console.log(Object.keys(req.session))
  if (!req.session.currentUser) {
      return res.redirect('/auth/login');
  }

  try {
      const user = await User.findById(req.session.currentUser._id);
      const transactions = await Transaction.find({ user: req.session.currentUser._id });
      // Pass user object to the dashboard view
      res.render('dashboard', { 
          title: 'Dashboard', 
          user, 
          transactions 
      });
  } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).send("Error loading the dashboard");
  }
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});