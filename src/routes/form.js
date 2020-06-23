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

// Form
router.get('/distributedForm', function (req, res, next) {
    res.render('form/distributedForm', {
        title: 'QuickStart - Distributed Form',
    });
});

router.get('/adhocForm', function (req, res, next) {
    res.render('form/adhocForm', {
        title: 'QuickStart - Adhoc Form',
    });
});

router.get('/formHistory', function (req, res, next) {
    res.render('form/formHistory', {
        title: 'QuickStart - Form History',
    });
});

router.get('/formManagement', function (req, res, next) {
    res.render('form/formManagement', {
        title: 'QuickStart - Form Management',
    });
});

module.exports = router;
