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
router.get('/announcement', isLoggedIn, function(req, res, next) {
    res.render('user/announcement', { title: 'user', req: req});
});

router.get('/dashboard', isLoggedIn, function(req, res, next) {
    res.render('user/dashboard', { title: 'user', req: req});
});

router.get('/forms', isLoggedIn, function(req, res, next) {
    res.render('user/forms', { title: 'user', req: req});
});

router.get('/group', isLoggedIn, function(req, res, next) {
    res.render('user/group', { title: 'user', req: req});
});

router.get('/user', isLoggedIn, function(req, res, next) {
    res.render('user/user', { title: 'user', req: req});
});

router.get('/storage', isLoggedIn, function(req, res, next) {
    res.render('user/storage', { title: 'user', req: req});
});

router.get('/analysis', isLoggedIn, function(req, res, next) {
    res.render('user/analysis', { title: 'user', req: req});
});

router.get('/viewMyData', isLoggedIn, function(req, res, next) {
    res.render('user/viewMyData', { title: 'user', req: req});
});


router.get('/createuser', isLoggedIn, function(req, res, next) {
    res.render('user/createuser', { title: 'createuser', req: req});
});

module.exports = router;