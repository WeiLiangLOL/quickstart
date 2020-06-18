// Initialise express web server
var express = require('express');
var app = express();

// Web server logger
if ((process.env.NODE_ENV || '').trim() !== 'test') {
    // Log all requests
    var logger = require('morgan');
    app.use(logger('dev'));
}

// View engine setup
var path = require('path');
app.set('views', path.join(__dirname, 'src/views')); // Set dir of views
app.set('view engine', 'ejs'); // Selects engine used to render views
app.use(express.static(path.join(__dirname, 'src/public'))); // Set dir of static files (img, css, js, etc.)

// Pre-parsing of requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize sequelize
var sequelize = require('./etc/sequelize');
sequelize.init();

// Session and authentication
var session = require('./etc/session');
session.init(app);

// Configure locals
var locals = require('./etc/templating');
locals.init(app);

// Attach api routing
var gatewayRouter = require('./src/api');
app.use('/api', gatewayRouter);

// Authentication
var authRouter = require('./src/routes/session');
app.use('/', authRouter);

// Route views
var indexRouter = require('./src/routes/index');
app.use('/', indexRouter);

// Authenticated route views
var userRouter = require('./src/routes/user');
app.use('/user', userRouter);

// Catch 404 and forward to error handler
var createError = require('http-errors');
app.use(function (req, res, next) {
    next(createError(404)); // Fall thru
});

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
