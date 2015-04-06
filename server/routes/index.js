var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { 
      title: 'Angular TODO App',
      user : req.user
  });
});

/* GET profile page. */
router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
        title: 'Profile',
        user : req.user
    });
});

// function to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // if not logged go to default route
    res.redirect('/login');
}

/* GET logout route. */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET login page. */
router.get('/login', function(req, res) {
    res.render('login', { 
        title: 'Login',
        message: req.flash('loginMessage') });
});

/* POST login data. */
router.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));

/* GET signup page. */
router.get('/register', function(req, res) {
    res.render('register', { 
        title: 'Register',
        message: req.flash('signupMessage') });
});

/* POST signup data. */
router.post('/register', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect : '/profile',
    failureRedirect : '/register',
    failureFlash : true
}));

module.exports = router;
