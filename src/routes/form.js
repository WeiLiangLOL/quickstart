var express = require('express');
var router = express.Router();

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
