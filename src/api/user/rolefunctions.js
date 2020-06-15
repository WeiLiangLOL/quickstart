const router = require('express').Router();
const debug = require('debug')('quickstart:api-rolefunctions');
const finale = require('finale-rest');
const bcrypt = require('bcrypt');

const database = require('../../../etc/sequelize').database;

// Initialize finale
finale.initialize({
    app: router,
    sequelize: database.sequelize,
});

// Create REST resource
const resource = finale.resource({
    model: database.rolefunctions,
    endpoints: ['/', '/:rolefunctionid'],
    associations: false,
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
