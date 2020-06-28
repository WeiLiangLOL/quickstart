const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        // User is already logged in, dont show login page
        res.redirect('/announcement');
    } else {
        res.render('auth/login');
    }
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/announcement',
        failureRedirect: '/auth/login?success=false',
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
