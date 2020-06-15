const router = require('express').Router();
const debug = require('debug')('quickstart:api-groups');
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
    model: database.groups,
    endpoints: ['/', '/:groupname'],
    associations: false,
});

resource.delete.write.before((req, res, context) => {
    if (req.params.groupname === 'root') {
        res.status(400).send({ message: 'Cannot delete root group' });
        context.stop();
        return;
    }

    context.continue();
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
