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

router.get('/userguide/general', function (req, res, next) {
    res.render('userguide/general');
});
router.get('/userguide/api', function (req, res, next) {
    res.render('userguide/api');
});
router.get('/userguide/admin', function (req, res, next) {
    res.render('userguide/admin');
});
router.get('/userguide/storage', function (req, res, next) {
    res.render('userguide/storage');
});

router.get('/about', function (req, res, next) {
    res.render('about');
});

module.exports = router;
