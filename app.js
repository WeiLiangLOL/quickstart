// Initialise express web server
var express = require('express');
var app = express();

// Log all requests
if ((process.env.NODE_ENV || '').trim() !== 'test') {
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

// For non-production servers
if ((process.env.NODE_ENV || '').trim() !== 'production') {
    // Generate empty dirs (that are missing)
    require('./bin/dir-sync').sync();
    // Start postgres database
    require('./bin/pgctl').start();
}

// Session and authentication
var session = require('./etc/session');
session.init(app);

// Initialize sequelize
var sequelize = require('./etc/sequelize');
sequelize.init();

// Attach api routing
var gatewayRouter = require('./src/api');
app.use('/api', gatewayRouter);

// Route views
var indexRouter = require('./src/routes/index');
app.use('/', indexRouter);

// Authenticated route views
var userRouter = require('./src/routes/user');
app.use('/user', userRouter);

// catch 404 and forward to error handler
var createError = require('http-errors');
app.use(function (req, res, next) {
    next(createError(404)); // Fall thru
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
