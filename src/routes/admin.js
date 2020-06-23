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

// User Management
router.get('/group', function (req, res, next) {
    res.render('admin/group');
});
router.get('/user', function (req, res, next) {
    res.render('admin/user');
});

module.exports = router;
