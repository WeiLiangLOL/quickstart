const router = require('express').Router();
const debug = require('debug')('quickstart:api-memberships');
const finale = require('finale-rest');

const database = require('../../../etc/sequelize').database;

// Initialize finale
finale.initialize({
    app: router,
    sequelize: database.sequelize,
});

// Create REST resource
var resource = finale.resource({
    model: database.memberships,
    endpoints: ['/', '/:membershipid'],
    associations: false,
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
