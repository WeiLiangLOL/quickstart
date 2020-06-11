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

// Expose all entries
router.get('/', (req, res, next) => {
    res.send(resources);
});

router.use((req, res, next) => {
    res.status(404).send({ message: 'Unknown API resource' });
});

module.exports = router;
