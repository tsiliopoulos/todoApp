// Import passport module
var LocalStrategy = require('passport-local').Strategy;

// Import the user model
var User = require('../../server/models/user');

module.exports = function(passport) {
    // passport setup
    
    // serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // Configure local login strategy
    passport.use('local-login', new LocalStrategy({
        // change default username and password, to email and password
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email) {
            // format to lower-case
            email = email.toLowerCase();
        }
        
        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' : email }, function(err, user) {
                // if errors
                if (err) { return done(err); }
                // check errors and bring the messages
                if (!user) {
                    // third parameter is a flash warning message
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Warning! Wrong password.'));
                } else {
                    // everything ok, get user
                    return done(null, user);
                }
            });
        });
    }));
    
    // Configure signup local strategy
    passport.use('local-signup', new LocalStrategy({
        // change default username and password, to email and password
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email) {
            // format to lower-case
            email = email.toLowerCase();
        }
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' : email },
                function(err, user) {
                    // if errors
                    if (err) { return done(err); }
                    // check email
                    if (user) {
                        return done(null, false, req.flash('signupMessage','Warning! the email is already taken.'));
                    } 
                    else {
                        // create the user
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err) { throw err; }
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // everything ok, register user
                return done(null, req.user);
            }
        });
    }));
};