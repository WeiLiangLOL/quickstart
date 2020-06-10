const router = require('express').Router();
const debug = require('debug')('quickstart:gateway-users');

const database = require('../../etc/sequelize').database;

// TODO: Decide on error message
// Should we show the classname of error message or show a generic message?

/**
 * Get user view
 */
router.get('/user', (req, res, next) => {
    // Variables
    var limit = 50;
    var offset = 0;
    if (parseInt(req.body.limit)) limit = parseInt(req.body.limit);
    if (parseInt(req.body.offset)) offset = parseInt(req.body.offset);

    // Query String
    var queryString = 'SELECT * FROM quickstart.user_view ';
    queryString += 'ORDER BY username ASC ';
    queryString += 'LIMIT $1 ';
    queryString += 'OFFSET $2;';

    // Perform query
    database.sequelize
        .query(queryString, {
            bind: [limit, offset],
            type: database.sequelize.QueryTypes.SELECT, // Hide metadata
        })
        .then((result) => {
            res.send(JSON.stringify(result));
        })
        .catch((err) => {
            res.status(400).send({
                message: Object.getPrototypeOf(err).constructor.name,
            });
        });
});

/**
 * Catch all other requests
 * Creates HTTP Error 405: Method not allowed
 */
router.use((req, res, next) => {
    // HTTP Status 405: Method not allowed
    var createError = require('http-errors');
    next(createError(405));
});

module.exports = router;
