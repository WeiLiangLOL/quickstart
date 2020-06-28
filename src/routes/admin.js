var express = require('express');
var router = express.Router();

// User Management
router.get('/group', function (req, res, next) {
    res.render('admin/group');
});
router.get('/user', function (req, res, next) {
    res.render('admin/user');
});

module.exports = router;
