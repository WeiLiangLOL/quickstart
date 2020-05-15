var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'QuickStart' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'QuickStart' });
});

module.exports = router;
