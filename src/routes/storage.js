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

// Data Management
router.get('/files', function (req, res, next) {
    res.render('storage/files', {
        title: 'QuickStart - Files',
    });
});
router.get('/analysis', function (req, res, next) {
    res.render('storage/analysis', {
        title: 'QuickStart - Analysis',
    });
});
router.get('/myData', function (req, res, next) {
    res.render('storage/myData', {
        title: 'QuickStart - My Data',
    });
});

module.exports = router;
