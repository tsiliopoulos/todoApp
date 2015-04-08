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

/* GITHUB Login Strategy Routes */
router.get('/auth/github', passport.authenticate('github'),
    function(req, res){
});

router.get('/auth/github/callback', passport.authenticate('github', { 
    successRedirect : '/',
    failureRedirect: '/login', 
    failureFlash:true
}));

/* TWITTER Login Strategy Routes */
router.get('/auth/twitter', passport.authenticate('twitter'),
    function(req, res){
});

router.get('/auth/twitter/callback', passport.authenticate('twitter', { 
    successRedirect : '/',
    failureRedirect: '/login', 
    failureFlash:true
}));

/* LinkedIn Login Strategy Routes */
router.get('/auth/linkedin', passport.authenticate('linkedin'),
    function(req, res){
});

router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { 
    successRedirect : '/',
    failureRedirect: '/login', 
    failureFlash:true
}));

/* GOOGLE Login Strategy Routes */
router.get('/auth/google', passport.authenticate('google',{
    failureRedirect: '/login', 
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
}),
    function(req, res){
});

router.get('/auth/google/callback', passport.authenticate('google', { 
    successRedirect : '/',
    failureRedirect: '/login', 
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    failureFlash:true
}));



module.exports = router;
