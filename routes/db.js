var {Sequelize} = require('sequelize');
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

function renderFailure(req, res, msg) {
	return res.render('user/failure', {
		title: 'failure',
		username: req.body.username,
		msg: msg
	});
}

// Place routes below
router.post('/createuser', isLoggedIn, function(req, res, next) {
    bcrypt.hash(req.body.password, 12).then( password_hash => {
		
		// TODO Input validation
		
		// TODO Change empty strings to null?
		
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
            res.render('user/success', { title: 'success', username: req.body.username});
        } else {
			renderFailure(req, res, 'Duplicate Entry');
        }
    }).catch( err => {
		renderFailure(req, res, Object.getPrototypeOf(err).constructor.name);
	});
});

/**
 * Retrieve all groups from table 'database.groups' 
 * Data is in the form of array of dictionary
 * Each dictionary represents a row in the table
 */
router.get('/getGroup', isLoggedIn, function(req, res, next) {
	// Todo: Check user has user_mgmt_priv
	database.groups.findAll().then( groups => {
		res.send(groups);
	});
});

/**
 * Add a group to the database
 *
 * Use req.body.groupname as groupname
 * Use req.body.supergroup as supergroup
 */
router.post('/addGroup', isLoggedIn, function(req, res, next) {
	// Todo: Check user has user_mgmt_priv
	
	// Input validation
	// Ensure fields are not null, not undefined, not empty string, not false, not 0
	if (!req.body.groupname || !req.body.supergroup) {
		return renderFailure(req, res, 'Fields cannot be empty');
	}
	if (req.body.groupname === req.body.supergroup) {
		return renderFailure(req, res, 'Cannot be supergroup of itself');
	}
	
	// Attempt to create group in database
	database.groups.findOrCreate({
		where: req.body
	}).then( data => {
		var created = data[1];
		if (created) {
			res.render('user/success', { title: 'success', username: req.body.username});
		} else {
			renderFailure(req, res, 'Duplicate Entry');
		}
	}).catch( err => {
		// Catch Foreign key constraint, Unique primary key constraint and others
		renderFailure(req, res, Object.getPrototypeOf(err).constructor.name);
	});
});

/**
 * Removes a group from table 'database.groups'
 *
 * Use req.body.groupname as groupname
 * Use req.body.supergroup as supergroup
 */
router.post('/deleteGroup', isLoggedIn, function(req, res, next) {
	// Todo: Check user has user_mgmt_priv
	
	// Input validation
	// Ensure fields are not null, not undefined, not empty string, not false, not 0
	if (!req.body.groupname || !req.body.supergroup) {
		return renderFailure(req, res, 'Fields cannot be empty');
	}
	if (req.body.groupname === req.body.supergroup) {
		return renderFailure(req, res, 'Group cannot be supergroup of itself');
	}
	
	// Attempt to remove row in database
	database.groups.destroy({
		where: req.body
	}).then( resolve => {
		res.render('user/success', { title: 'success', username: req.body.username});
	}, reject => {
		renderFailure(req, res, reject);
		
	});
});


/**
 * Obtain list of users
 * Specify offset and limit via GET parameters
 * Returns an array of users
 */
router.get('/getUser', isLoggedIn, function(req, res, next) {
	// Todo: Check user has user_mgmt_priv
    
    // Obtain GET parameters
    var offset = req.query.offset;
    var limit = req.query.limit;
    
    // Set default value
    if (!offset) offset = 0;
    if (!limit) limit = 50;
    
    var queryString = 'SELECT * FROM quickstart.get_user_list(' + offset + ', ' + limit + ');';
	database.sequelize.query(
        queryString,
        { type: database.sequelize.QueryTypes.SELECT }
    ).then(result => {
        res.send(JSON.stringify(result));
    }).catch(err => {
        console.log(err);
        next(err);
    });
});

















module.exports = router;
