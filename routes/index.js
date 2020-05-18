var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index' });
});

router.get('/features', function(req, res, next) {
  res.render('features', { title: 'features' });
});

router.get('/userGuide', function(req, res, next) {
  res.render('userGuide', { title: 'userGuide' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

module.exports = router;
