var database = require('../database').database;
var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

// Middleware to make sure user is logged in before accessing restricted pages
// Redirects to /login if user is not logged in.
function isLoggedIn(req, res, next) {
    // If user is logged in, passport.js will create user object 
    // in req for every request in express.js, which you can check 
    // for existence in any middleware
    if (req.isAuthenticated()) {
        next(); // Is logged in
    } else {
        res.redirect('/login');
    }
}

// Place routes below
router.post('/createuser', isLoggedIn, function(req, res, next) {
    database.users.findOrCreate({
        where: { username: req.body.username },
        defaults: {
            username: req.body.username,
            passwordHash: bcrypt.hashSync(req.body.password, 12),
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            phoneNumber: req.body.phone,
            email: req.body.email,
            dateOfBirth: req.body.dob,
            gender: req.body.gender,
            nationality: req.body.nationality
        }
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


module.exports = router;
