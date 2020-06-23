var express = require('express');
var router = express.Router();

// Authentication check: redirects to login page if user is not logged in.
router.use(function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    next();
});

// Place routes below

router.get('/', function (req, res, next) {
    res.render('profile/profile', {
        title: 'QuickStart - Profile',
    });
});

module.exports = router;
