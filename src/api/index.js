const debug = require('debug')('quickstart:api-error');
const express = require('express');
const router = express.Router();

/**
 * Base class for RESTful gateway communication
 */

// TODO: Authentication

const resources = [
    // Main entities (User)
    { path: '/users', module: require('./user/users') },
    { path: '/groups', module: require('./user/groups') },
    { path: '/roles', module: require('./user/roles') },
    { path: '/functions', module: require('./user/functions') },
    { path: '/privileges', module: require('./user/privileges') },
    { path: '/memberships', module: require('./user/memberships') },
    { path: '/rolefunctions', module: require('./user/rolefunctions') },
    // Main entities (Data)
    { path: '/directories', module: require('./data/directories') },
    { path: '/regular_files', module: require('./data/regular_files') },
    { path: '/data_files', module: require('./data/data_files') },

    { path: '/group_datafile_acls', module: require('./data/group_datafile_acls') },
    { path: '/group_dir_acls', module: require('./data/group_dir_acls') },
    { path: '/group_regfile_acls', module: require('./data/group_regfile_acls') },

    { path: '/user_datafile_acls', module: require('./data/user_datafile_acls') },
    { path: '/user_dir_acls', module: require('./data/user_dir_acls') },
    { path: '/user_regfile_acls', module: require('./data/user_regfile_acls') },

    // Others
    { path: '/views', module: require('./views') },
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
    debug(err);
});

module.exports = router;
