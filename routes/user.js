var express = require('express');
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
        res.redirect('/login');
    }
}

// Place routes below

// Announcement
router.get('/announcement', isLoggedIn, function(req, res, next) {
    res.render('user/announcement', { title: 'user', username: req.user.username});
});

// Dashboard
router.get('/dashboard', isLoggedIn, function(req, res, next) {
    res.render('user/dashboard', { title: 'user', username: req.user.username});
});

// Form
router.get('/formPending', isLoggedIn, function(req, res, next) {
    res.render('user/formPending', { title: 'user', username: req.user.username});
});
router.get('/formSpecial', isLoggedIn, function(req, res, next) {
    res.render('user/formSpecial', { title: 'user', username: req.user.username});
});
router.get('/formHistory', isLoggedIn, function(req, res, next) {
    res.render('user/formHistory', { title: 'user', username: req.user.username});
});
router.get('/formManagement', isLoggedIn, function(req, res, next) {
    res.render('user/formManagement', { title: 'user', username: req.user.username});
});

// User Management
router.get('/group', isLoggedIn, function(req, res, next) {
    res.render('user/group', { title: 'user', username: req.user.username});
});
router.get('/user', isLoggedIn, function(req, res, next) {
    res.render('user/user', { title: 'user', username: req.user.username});
});

// Data Management
router.get('/storage', isLoggedIn, function(req, res, next) {
    res.render('user/storage', { title: 'user', username: req.user.username});
});
router.get('/analysis', isLoggedIn, function(req, res, next) {
    res.render('user/analysis', { title: 'user', username: req.user.username});
});
router.get('/viewMyData', isLoggedIn, function(req, res, next) {
    res.render('user/viewMyData', { title: 'user', username: req.user.username});
});

// Remove when done
router.get('/createuser', isLoggedIn, function(req, res, next) {
    res.render('user/createuser', { title: 'createuser', username: req.user.username});
});

module.exports = router;
