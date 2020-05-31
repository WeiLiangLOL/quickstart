// Initialise express web server
var express = require('express');
var app = express();

// Log all requests
var logger = require('morgan');
app.use(logger('dev'));

// View engine setup
var path = require('path');
app.set('views', path.join(__dirname, 'views')); // Set dir of views
app.set('view engine', 'ejs'); // Set default ext of views
app.use(express.static(path.join(__dirname, 'public'))); // Set dir of static files (img, css, js, etc.)

// Pre-parsing of requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session and authentication
var session = require('./auth/session');
session.init(app);

// Attach database
var database = require('./database');
database.init();

// Route views
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Authenticated route views
var userRouter = require('./routes/user');
app.use('/user', userRouter);

// POST to database route
var dbRouter = require('./routes/db');
app.use('/db', dbRouter);

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
