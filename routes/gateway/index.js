const express = require('express');
const router = express.Router();

/**
 * Base class for RESTful gateway communication
 */

router.use('/users', require('./users'));
// TODO: router.use('/groups', require('./groups'));

module.exports = router;
