var express = require('express');
var router = express.Router();

// Dashboard
router.get('/', function (req, res, next) {
    res.render('dashboard/dashboard', {
        title: 'QuickStart - Dashboard',
    });
});

module.exports = router;
