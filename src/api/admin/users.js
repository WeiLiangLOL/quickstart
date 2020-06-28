const router = require('express').Router();
const debug = require('debug')('quickstart:api-users');
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
    model: database.users,
    endpoints: ['/', '/:username'],
    excludeAttributes: ['password_hash'],
    associations: true,
});

// Alter default handling
resource.create.write.before((req, res, context) => {
    let user = req.body;

    // Basic input check (short of validation)
    if (!user.username || !user.password || !user.firstname || !user.lastname) {
        throw new finale.Errors.BadRequestError('Empty fields');
    }
    if (user.date_of_birth === '') delete user.date_of_birth;
    if (user.allow_login !== 'true') user.allow_login = 'false';

    // Hash incoming password
    bcrypt.hash(user.password, 12).then((password_hash) => {
        delete user.password;
        user.password_hash = password_hash;
        context.continue();
    });
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
