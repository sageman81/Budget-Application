const bcrypt = require('bcrypt');
const saltRounds = 10; // Define the number of salt rounds for hashing
const router = require('express').Router();
const User = require('../models/User'); // Adjust the path as necessary

// Display the signup form
router.get('/signup', (req, res) => {
    res.render('users/newUser'); // Assuming 'newUser.ejs' is in 'views/users/'
});

// Process the signup form
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).send('Username and password are required.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user in the database
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        // Set user information in the session
        req.session.userId = newUser._id;
        req.session.username = newUser.username;

        // Redirect to the dashboard or another appropriate page
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during sign up:", error);
        res.status(500).send('Error signing up.');
    }
});

// Display the login form
router.get('/login', (req, res) => {
    res.render('sessions/login'); // Assuming 'login.ejs' is in 'views/sessions/'
});

// Process the login form
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Attempt to find the user by username
        const foundUser = await User.findOne({ username });

        if (!foundUser) {
            return res.status(401).send('User not found');
        }

        // Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (isMatch) {
            // Set user information in the session
            req.session.userId = foundUser._id;
            req.session.username = foundUser.username;

            // Redirect to the dashboard
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Password does not match');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Log out the user
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out');
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;

