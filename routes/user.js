var express = require("express");
var router = express.Router();

// Middleware to make sure user is logged in before viewing user page
// Redirects to /login if user is not logged in.
function isLoggedIn(req, res, next) {
    // If user is logged in, passport.js will create user object
    // in req for every request in express.js, which you can check
    // for existence in any middleware
    if (req.isAuthenticated()) {
        next(); // Is logged in
    } else {
        res.redirect("/login");
    }
}

// Place routes below

// Announcement
router.get('/announcement', isLoggedIn, function(req, res, next) {
    res.render('user/announcement', { title: 'user', req: req});
});

// Dashboard
router.get('/dashboard', isLoggedIn, function(req, res, next) {
    res.render('user/dashboard', { title: 'user', req: req});
});

// Form
router.get('/formPending', isLoggedIn, function(req, res, next) {
    res.render('user/formPending', { title: 'user', req: req});
});
router.get('/formSpecial', isLoggedIn, function(req, res, next) {
    res.render('user/formSpecial', { title: 'user', req: req});
});
router.get('/formHistory', isLoggedIn, function(req, res, next) {
    res.render('user/formHistory', { title: 'user', req: req});
});
router.get('/formManagement', isLoggedIn, function(req, res, next) {
    res.render('user/formManagement', { title: 'user', req: req});
});

// User Management
router.get('/group', isLoggedIn, function(req, res, next) {
    res.render('user/group', { title: 'user', req: req});
});
router.get('/user', isLoggedIn, function(req, res, next) {
    res.render('user/user', { title: 'user', req: req});
});

// Data Management
router.get('/storage', isLoggedIn, function(req, res, next) {
    res.render('user/storage', { title: 'user', req: req});
});
router.get('/analysis', isLoggedIn, function(req, res, next) {
    res.render('user/analysis', { title: 'user', req: req});
});
router.get('/viewMyData', isLoggedIn, function(req, res, next) {
    res.render('user/viewMyData', { title: 'user', req: req});
});

// Remove when done
router.get('/createuser', isLoggedIn, function(req, res, next) {
    res.render('user/createuser', { title: 'createuser', req: req});
});

module.exports = router;
