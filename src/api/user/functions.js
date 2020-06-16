const router = require('express').Router();
const debug = require('debug')('quickstart:api-functions');
const finale = require('finale-rest');
const bcrypt = require('bcrypt');

const database = require('../../../etc/sequelize').database;

/**
 * Table 'functions' is intentionally read only
 *
 * Only GET methods should work
 * Other POST, PUT and DELETE should not work
 */

// Initialize finale
finale.initialize({
    app: router,
    sequelize: database.sequelize,
});

// Create REST resource
const resource = finale.resource({
    model: database.functions,
    endpoints: ['/', '/:functionname'],
    associations: false,
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
