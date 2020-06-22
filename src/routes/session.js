const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        // User is already logged in, dont show login page
        res.redirect('/user');
    } else {
        res.render('login');
    }
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/user/announcement',
        failureRedirect: '/login?success=false',
    })
);

module.exports = router;
