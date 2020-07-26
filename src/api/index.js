const debug = require('debug')('quickstart:api-error');
const express = require('express');
const router = express.Router();

/**
 * Base class for RESTful gateway communication
 */
const resources = [
    // Main entities (admin)
    { path: '/users', module: require('./admin/users') },
    { path: '/groups', module: require('./admin/groups') },
    { path: '/roles', module: require('./admin/roles') },
    { path: '/functions', module: require('./admin/functions') },
    { path: '/privileges', module: require('./admin/privileges') },
    { path: '/memberships', module: require('./admin/memberships') },
    { path: '/rolefunctions', module: require('./admin/rolefunctions') },
    // Main entities (storage)
    { path: '/directories', module: require('./storage/directories') },
    { path: '/regular_files', module: require('./storage/regular_files') },
    { path: '/data_files', module: require('./storage/data_files') },
    {
        path: '/group_datafile_acls',
        module: require('./storage/group_datafile_acls'),
    },
    { path: '/group_dir_acls', module: require('./storage/group_dir_acls') },
    {
        path: '/group_regfile_acls',
        module: require('./storage/group_regfile_acls'),
    },
    {
        path: '/user_datafile_acls',
        module: require('./storage/user_datafile_acls'),
    },
    { path: '/user_dir_acls', module: require('./storage/user_dir_acls') },
    {
        path: '/user_regfile_acls',
        module: require('./storage/user_regfile_acls'),
    },
    // Misc entities
    {
        path: '/announcements',
        module: require('./misc/announcements'),
    },
];

// Load all API routes
for (let resource of resources) router.use(resource.path, resource.module);

/**
 * Show list of available api paths
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
