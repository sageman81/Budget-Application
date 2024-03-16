const bcrypt = require('bcrypt');
const router = require('express').Router()
const db = require('../models');

router.get('/new', (req, res) => {
    res.render('sessions/new.ejs', { 
        current: req.session.userId 
    })
})

router.post('/', async  (req, res) => {
   
    const foundUser = await db.User.findOne({ username: req.body.username })
  

    if(!foundUser){
        return res.send('User not found')
    
    }else if( await bcrypt.compareSync(req.body.password, foundUser.password)){
       
        req.session.currentUser = foundUser 

        res.redirect('/')
  
    }else{
        res.send('Password does not match')
    }
})

router.delete('/', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

module.exports = router