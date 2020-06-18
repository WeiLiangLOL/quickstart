var express = require('express');
var passport = require('passport');
var router = express.Router();

/*
 * Main Navigation
 */

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/features', function (req, res, next) {
    res.render('general/features');
});

router.get('/userGuide', function (req, res, next) {
    res.render('general/userGuide');
});

router.get('/about', function (req, res, next) {
    res.render('general/about');
});

module.exports = router;
