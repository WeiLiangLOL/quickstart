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
        title: 'announcement',
        username: req.user.username,
    });
});

// Dashboard
router.get('/dashboard', function (req, res, next) {
    res.render('user/dashboard', {
        title: 'dashboard',
        username: req.user.username,
    });
});

// Form
router.get('/distributedForm', function (req, res, next) {
    res.render('user/distributedForm', {
        title: 'distributedForm',
        username: req.user.username,
    });
});
router.get('/adhocForm', function (req, res, next) {
    res.render('user/adhocForm', {
        title: 'adhocForm',
        username: req.user.username,
    });
});
router.get('/formHistory', function (req, res, next) {
    res.render('user/formHistory', {
        title: 'formHistory',
        username: req.user.username,
    });
});
router.get('/formManagement', function (req, res, next) {
    res.render('user/formManagement', {
        title: 'formManagement',
        username: req.user.username,
    });
});

// User Management
router.get('/group', function (req, res, next) {
    res.render('user/group', {
        title: 'group',
        username: req.user.username,
    });
});
router.get('/user', function (req, res, next) {
    res.render('user/user', {
        title: 'user',
        username: req.user.username,
    });
});

// Data Management
router.get('/storage', function (req, res, next) {
    res.render('user/storage', {
        title: 'storage',
        username: req.user.username,
    });
});
router.get('/analysis', function (req, res, next) {
    res.render('user/analysis', {
        title: 'analysis',
        username: req.user.username,
    });
});
router.get('/viewMyData', function (req, res, next) {
    res.render('user/viewMyData', {
        title: 'viewMyData',
        username: req.user.username,
    });
});

// Remove when done
router.get('/createuser', function (req, res, next) {
    res.render('user/createuser', {
        title: 'createuser',
        username: req.user.username,
    });
});

module.exports = router;
