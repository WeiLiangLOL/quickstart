var express = require('express');
var router = express.Router();

// If user is logged in, passport.js will create user object 
// in req for every request in express.js, which you can check 
// for existence in any middleware
function isLoggedIn(req, res, next) {
    if (req.user) {
        next(); // Is logged in
    } else {
        res.redirect('/auth/login');
    }
}

// Ignore the top, just place routes here
router.get('/', isLoggedIn, function(req, res, next) {
    res.render('restricted', { title: 'restricted' });
});

module.exports = router;
