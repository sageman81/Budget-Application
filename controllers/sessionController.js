const bcrypt = require('bcrypt');
const router = require('express').Router()
const db = require('../models');
const User = require('../models/User');

router.get('/new', (req, res) => {
    res.render('sessions/new', { 
        currentUser: req.session.currentUser 
    })
})

router.post('/login', async (req, res) => {
    try {
        // Attempt to find the user by username
        const foundUser = await User.findOne({ username: req.body.username });

        if (!foundUser) {
            // If no user is found, send an appropriate response
            res.status(401).send('User not found');
        } else {
            // If a user is found, compare the submitted password with the stored hash
            const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
            if (isMatch) {
                // If the passwords match, set session variables
                req.session.userId = foundUser._id;
                req.session.username = foundUser.username; // Optionally store other useful information

                // Redirect the user to their dashboard
                res.redirect('/dashboard');
            } else {
                // If the passwords do not match, send an error message
                res.status(401).send('Password does not match');
            }
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/login', (req, res) => {
    res.render('sessions/login');
});

router.post('/login', async (req, res) => {
    // Authentication logic here
    // On successful login, redirect to another page
    // On failure, render the login page again with an error message
});

router.post('/signup', async (req, res) => {
    try {
        // Example of creating a new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword,
            // Include any other user fields you need
        });

        // Directly log the user in by setting session variables
        req.session.userId = newUser._id; // Or whatever user identifier you prefer
        req.session.username = newUser.username; // Optionally store other useful information

        // Redirect the user to their dashboard or home page
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during sign up:", error);
        res.status(500).send('Error signing up.');
    }
});

router.post('/', async  (req, res) => {
    // 1) Find the user trying to log in (so that we can compare passwords)
    const foundUser = await db.User.findOne({ username: req.body.username })
    // 2) after we find the user compare passwords

    if(!foundUser){
        return res.send('User not found')
    
    }else if( await bcrypt.compareSync(req.body.password, foundUser.password)){
        // 3) if the passwords match, create a new session
        req.session.currentUser = foundUser // currentUser will exist on the req.session as long as this users is logged in, this allows to query the databse where the owner of an item = currentUser.id 

        res.redirect('/')
    //       2a) if the passwords match, create a new session
    //       2b) if the passwords don't match, send an error messag
    }else{
        res.send('Password does not match')
    }
})
// log out aka destroy the session
router.delete('/', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

module.exports = router;
