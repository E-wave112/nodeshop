//route handlers for google auth

const router = require('express').Router();
const passport = require('passport')

//intitialize google auth

router.get('/google', passport.authenticate('google',{scope:['profile']}))


//call back route with /auth/google/callback

router.get('/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),
(req, res) => {
    res.redirect('/')

})
  // Successful authentication, redirect home.

  //logout users

router.get('/logout', (req,res)=> {
    req.logout()
    res.redirect('/login')

})

module.exports = router