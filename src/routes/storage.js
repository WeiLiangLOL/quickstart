var express = require('express');
var router = express.Router();

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
