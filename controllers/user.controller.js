const bcrypt = require('bcrypt');
const router = require('express').Router();
const db = require('../models');

// Login page
router.get('/login', (req, res) => {
    // The route has been updated to '/login' for clarity
    // Removed the unused 'current' variable passed to the template
    res.render('sessions/login.ejs'); // Assuming 'sessions/login.ejs' is the login form
});

// Process login
router.post('/login', async (req, res) => {
    // Changed to '/login' to match the GET route and clarify the action
    const { username, password } = req.body;

    try {
        const foundUser = await db.User.findOne({ username: username });

        if (!foundUser) {
            return res.send('User not found');
        } else if (await bcrypt.compare(password, foundUser.password)) {
            // Successful login
            req.session.currentUser = foundUser; // Set the currentUser in session
            res.redirect('/');
        } else {
            // Password does not match
            res.send('Password does not match');
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout
router.get('/logout', (req, res) => {
    // Changed to a GET request for logging out, which is a common practice
    req.session.destroy(() => {
        res.redirect('/'); // Redirect to the home page or login page after logout
    });
});

module.exports = router;
