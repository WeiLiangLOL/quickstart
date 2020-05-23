var express = require('express');
var router = express.Router();

// If user is logged in, passport.js will create user object 
// in req for every request in express.js, which you can check 
// for existence in any middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next(); // Is logged in
    } else {
        res.redirect('/login');
    }
}

// Ignore the top, just place routes here
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('user/index', { title: 'user', req: req});
});


router.get('/createuser', isLoggedIn, function(req, res, next) {
    res.render('user/createuser', { title: 'createuser', req: req});
});

module.exports = router;
