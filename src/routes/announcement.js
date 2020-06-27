var express = require('express');
var router = express.Router();

// Announcement
router.get('/', function (req, res, next) {
    res.locals.app.theme = 'dark';
    res.render('announcement/announcement', {
        title: 'QuickStart - Announcement',
    });
});


module.exports = router;
