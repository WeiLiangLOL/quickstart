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

// Announcement
router.get('/', function (req, res, next) {
    res.locals.app.theme = 'dark';
    res.render('announcement/announcement', {
        title: 'QuickStart - Announcement',
    });
});


module.exports = router;