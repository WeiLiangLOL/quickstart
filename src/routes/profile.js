var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('profile/profile', {
        title: 'QuickStart - Profile',
    });
});

module.exports = router;
