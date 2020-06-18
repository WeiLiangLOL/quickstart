var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'QuickStart - Home', req: req });
});

router.get('/features', function (req, res, next) {
    res.render('features', { title: 'QuickStart - Features', req: req });
});

router.get('/userGuide', function (req, res, next) {
    res.render('userGuide', { title: 'QuickStart - Guide', req: req });
});

router.get('/about', function (req, res, next) {
    res.render('about', { title: 'QuickStart - About', req: req });
});

/* Login page (GET) */
router.get('/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        // User is already logged in, dont show login page
        res.redirect('/user');
    } else {
        res.render('login', { title: 'QuickStart - Login', req: req });
    }
});

/* Logout, not a page */
router.get('/logout', function (req, res) {
    // https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L58
    req.logout(); // Remove user session
    res.redirect('/');
});

/* Login authentication (POST) */
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/user/announcement',
        failureRedirect: '/login?success=false',
    })
);

module.exports = router;
