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
    bcrypt.hash(req.body.password, 12).then( password_hash => {
		
		// TODO Input validation
		
		// Modify req.body to avoid errors
        req.body.password_hash = password_hash;
		delete req.body["password"];
		if (req.body.date_of_birth === '') delete req.body['date_of_birth'];
		if (req.body.allow_login !== 'true') req.body.allow_login = 'false';
		
        return database.users.findOrCreate({
            where: req.body,
            defaults: null
        });
    }).then( data => {
        var model = data[0];
        var created = data[1];
        if (created) {
            res.render('user/success', { title: 'success', req: req});
        } else {
            res.render('user/failure', { title: 'failure', req: req});
        }
    }).catch( err => {
		next(err);
	});
});

module.exports = router;
