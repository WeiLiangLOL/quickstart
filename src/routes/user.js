var express = require('express');
var router = express.Router();

// Authentication check: redirects to login page if user is not logged in.
router.use(function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
});

// Place routes below

// Announcement
router.get('/announcement', function (req, res, next) {
    res.render('user/announcement', {
        title: 'QuickStart - Announcement',
        username: req.user.username,
    });
});

// Dashboard
router.get('/dashboard', function (req, res, next) {
    res.render('user/dashboard', {
        title: 'QuickStart - Dashboard',
        username: req.user.username,
    });
});

// Form
router.get('/distributedForm', function (req, res, next) {
    res.render('user/distributedForm', {
        title: 'QuickStart - Distributed Form',
        username: req.user.username,
    });
});
router.get('/adhocForm', function (req, res, next) {
    res.render('user/adhocForm', {
        title: 'QuickStart - Adhoc Form',
        username: req.user.username,
    });
});
router.get('/formHistory', function (req, res, next) {
    res.render('user/formHistory', {
        title: 'QuickStart - Form History',
        username: req.user.username,
    });
});
router.get('/formManagement', function (req, res, next) {
    res.render('user/formManagement', {
        title: 'QuickStart - Form Management',
        username: req.user.username,
    });
});

// User Management
router.get('/group', function (req, res, next) {
    res.render('user/group', {
        title: 'QuickStart - Group Management',
        username: req.user.username,
    });
});
router.get('/user', function (req, res, next) {
    res.render('user/user', {
        title: 'QuickStart - User Management',
        username: req.user.username,
    });
});

// Data Management
router.get('/files', function (req, res, next) {
    res.render('user/files', {
        title: 'QuickStart - Files',
        username: req.user.username,
    });
});
router.get('/analysis', function (req, res, next) {
    res.render('user/analysis', {
        title: 'QuickStart - Analysis',
        username: req.user.username,
    });
});
router.get('/myData', function (req, res, next) {
    res.render('user/myData', {
        title: 'QuickStart - My Data',
        username: req.user.username,
    });
});

// Remove when done
router.get('/createuser', function (req, res, next) {
    res.render('user/createuser', {
        title: 'QuickStart - Create User',
        username: req.user.username,
    });
});

module.exports = router;
