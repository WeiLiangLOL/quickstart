var database = require('../database').database;
var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

// Middleware to make sure user is logged in before accessing restricted pages
// Redirects to /login if user is not logged in.
function isLoggedIn(req, res, next) {
    // If user is logged in, passport.js will create user object in req for every 
    // request in express.js, which you can check for existence in any middleware
    // https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74
    if (req.isAuthenticated()) {
        next(); // Is logged in
    } else {
        res.redirect('/login');
    }
}

// Place routes below
router.post('/createuser', isLoggedIn, function(req, res, next) {
    bcrypt.hash(req.body.password, 12).then( passwordHash => {
        req.body.passwordHash = passwordHash;
        return database.users.findOrCreate({
            where: { username: req.body.username },
            defaults: req.body
        });
    }).then( data => {
        var model = data[0];
        var created = data[1];
        if (created) {
            res.render('user/success', { title: 'success', req: req});
        } else {
            res.render('user/failure', { title: 'failure', req: req});
        }
    });
});

/*
            defaults: {
                username: req.body.username,
                passwordHash: passwordHash,
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                phoneNumber: req.body.phone,
                email: req.body.email,
                dateOfBirth: req.body.dob,
                gender: req.body.gender,
                nationality: req.body.nationality
            }
*/

module.exports = router;
