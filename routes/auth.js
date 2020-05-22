var passport = require('passport');
var express = require('express');
var router = express.Router();

/* Login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

/* Logout: remove login session and redirect to home page */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* Password authentication */
router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'})
);

// Deletable
// also remove views/success.ejs
// also edit successRedirect above
router.get('/success', function(req, res, next) {
  res.render('success', { title: 'success' });
});

// Deletable
// also remove views/failure.ejs
// also edit failureRedirect above
router.get('/failure', function(req, res, next) {
  res.render('failure', { title: 'failure' });
});

module.exports = router;
