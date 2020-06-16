const router = require('express').Router();
const debug = require('debug')('quickstart:api-group_datafile_acls');
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
    model: database.group_datafile_acls,
    endpoints: ['/', '/:permissionid'],
    associations: true,
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
