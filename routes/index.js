var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index', req: req});
});

router.get('/features', function(req, res, next) {
  res.render('features', { title: 'features', req: req});
});

router.get('/userGuide', function(req, res, next) {
  res.render('userGuide', { title: 'userGuide', req: req});
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about', req: req});
});

/* Login page (GET) */
router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) { // User is already logged in, dont show login page
    res.redirect('/user');
  } else {
    res.render('login', { title: 'login', req: req });
  }
});

/* Logout, not a page */
router.get('/logout', function(req, res) {
    // https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L58
    req.logout(); // Remove user session
    res.redirect('/');
});

/* Login authentication (POST) */
var passport = require('passport');
router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/user/announcement',
    failureRedirect: '/login?success=false'})
);

module.exports = router;
