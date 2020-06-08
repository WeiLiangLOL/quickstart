const express = require('express');
const router = express.Router();

/**
 * Base class for RESTful gateway communication
 */

// TODO: Authentication

router.use('/users', require('./users'));
router.use('/groups', require('./groups'));
router.use('/test', require('./template'));
router.use('/views', require('./views'));

module.exports = router;
