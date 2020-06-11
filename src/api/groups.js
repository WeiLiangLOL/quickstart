const router = require('express').Router();
const debug = require('debug')('quickstart:api-groups');
const finale = require('finale-rest');
const bcrypt = require('bcrypt');

const database = require('../../etc/sequelize').database;

// Initialize finale
finale.initialize({
    app: router,
    sequelize: database.sequelize,
});

// Create REST resource
const resource = finale.resource({
    model: database.groups,
    endpoints: ['/', '/:groupname'],
    associations: true,
});

// Alter default handling
// TODO: Check if this method is still necessary, I think the module self checks
resource.create.write.before((req, res, context) => {
    var groupname = req.body.groupname;
    var supergroup = req.body.supergroup;

    // Input Checking (Short of input validation)
    if (!groupname || !supergroup) {
        throw new finale.Errors.BadRequestError('Empty fields');
    }
    if (groupname === supergroup) {
        throw new finale.Errors.BadRequestError('Cannot be self parenting');
    }

    context.continue();
});

resource.delete.write.before((req, res, context) => {
    database.groups
        .destroy({ where: { groupname: req.params.groupname } })
        .then((numRowsDeleted) => {
            // Failure
            if (numRowsDeleted === 0) {
                return res
                    .status(400)
                    .send({ message: 'Group does not exist' });
            }
            // Success
            res.send({ rowsAffected: numRowsDeleted });
            context.stop();
        })
        .catch((err) => {
            debug(err);
            res.status(500).send({
                message: Object.getPrototypeOf(err).constructor.name,
            });
            context.stop();
        });
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
