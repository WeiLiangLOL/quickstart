const express = require('express');
const router = express.Router();

/**
 * Base class for RESTful gateway communication
 */

// TODO: Authentication

const resources = [
    // Main entities
    { path: '/users', module: require('./users') },
    { path: '/groups', module: require('./groups') },
    { path: '/memberships', module: require('./memberships') },
    { path: '/privileges', module: require('./privileges') },
    { path: '/roles', module: require('./roles') },
    // Others
    { path: '/views', module: require('./views') },
    { path: '/test', module: require('./template') },
];

for (let resource of resources) router.use(resource.path, resource.module);

/**
 * Show index of available api paths
 */
router.get('/', (req, res, next) => {
    res.send(resources);
});

/**
 * 404 handler for api requests
 *
 * Invoked when attempting to use an unsupported http method or when
 * requesting for an invalid api path within /api/
 */
router.use((req, res, next) => {
    res.status(404).send({ message: 'Unknown API resource' });
});

/**
 * Error handler for api requests
 */
router.use((err, req, res, next) => {
    // Do not call next()
    // Do not send response
    // finale-rest.js has taken care of it

    // Print error to debug
    require('debug')('quickstart:api-error')(err);
});

module.exports = router;
