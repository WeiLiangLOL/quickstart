var express = require('express');
var router = express.Router();

/*
 * Main Navigation
 */

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/features', function (req, res, next) {
    res.render('features');
});

router.get('/userGuide', function (req, res, next) {
    res.render('userGuide');
});

router.get('/about', function (req, res, next) {
    res.render('about');
});

module.exports = router;
