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

// Public routes (does not require login)
var indexRouter = require('./src/routes/index');
app.use('/', indexRouter);
var authRouter = require('./src/routes/auth');
app.use('/auth', authRouter);

// API routes (require login)
var gatewayRouter = require('./src/api');
app.use('/api', requireLogin, gatewayRouter);

// User routes (require login)
var profileRouter = require('./src/routes/profile');
app.use('/profile', requireLogin, profileRouter);
var announcementRouter = require('./src/routes/announcement');
app.use('/announcement', requireLogin, announcementRouter);
var dashboardRouter = require('./src/routes/dashboard');
app.use('/dashboard', requireLogin, dashboardRouter);
var formRouter = require('./src/routes/form');
app.use('/form', requireLogin, formRouter);
var storageRouter = require('./src/routes/storage');
app.use('/storage', requireLogin, storageRouter);
var adminRouter = require('./src/routes/admin');
app.use('/admin', requireLogin, adminRouter);

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

// Middleware that redirects if a user is not logged in
function requireLogin(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    next();
}
