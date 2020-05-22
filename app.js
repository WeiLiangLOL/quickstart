
// Initialise express web server
var express = require('express');
var app = express();

// View engine setup
var path = require('path');
app.set('views', path.join(__dirname, 'views')); // Set dir of views
app.set('view engine', 'ejs'); // Set default ext of views
app.use(express.static(path.join(__dirname, 'public'))); // Set dir of static files (img, css, js, etc.)

// Log all requests
var logger = require('morgan');
app.use(logger('dev'));

// Pre-parsing of POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session and authentication
var session = require('express-session');
var passport = require('passport');
app.use(session({ // TODO: Additional reading required to secure session
    secret: 'keyboard cat', // No idea what this does
    resave: true, // No idea what this does
    saveUninitialized: true // No idea what this does
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username, password, done) {
        // Warning: Undone
        if (username !== 'test') {
            return done(null, false, { message: 'Incorrect username'});
        }
        if (password !== '1234') {
            return done(null, false, { message: 'Incorrect password'});
        } 
        return done(null, 'testuser');
    }
));
passport.serializeUser(function(user, done) {
    // Warning: Undone
    done(null, user); 
});
passport.deserializeUser(function(user, done) {
    // Warning: Undone
    done(null, user);
});

// Attach database
var database = require('./database');
database.init();

// Route views
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
app.use('/', indexRouter);
app.use('/auth', authRouter);

// Authenticated route views
var restrictedRouter = require('./routes/restricted');
app.use('/user', restrictedRouter);


// catch 404 and forward to error handler
var createError = require('http-errors');
app.use(function(req, res, next) {
  next(createError(404)); // Fall thru
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
