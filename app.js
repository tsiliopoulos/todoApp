// Import the Modules / assign modules to variables
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');

// Modules to store session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// setup routes
var routes = require('./server/routes/index');
var users = require('./server/routes/users');
var todos = require('./server/routes/todos');

// Database configuration
var config = require('./server/config/config.js');
// connect to our database
mongoose.connect(config.url);

// Check if MongoDB is running
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var app = express();

// Passport configuration
require('./server/config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(session({
    secret: 'sometextgohere',
    saveUninitialized: true,
    resave: true,
    //store session on MongoDB using express-session + connect-mongo
    store: new MongoStore({
        url: config.url,
        collection : 'sessions'
    })
}));

// flash warning messages
app.use(flash());

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/todos', todos);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' +       server.address().port);
});

module.exports = app;
