const router = require('express').Router();
const debug = require('debug')('quickstart:api-announcements');
const finale = require('finale-rest');

const database = require('../../../etc/sequelize').database;

// Initialize finale
finale.initialize({
    app: router,
    sequelize: database.sequelize,
});

// Create REST resource
const resource = finale.resource({
    model: database.announcements,
    endpoints: ['/', '/:id'],
    associations: true,
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
