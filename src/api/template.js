const router = require('express').Router();
const debug = require('debug')('quickstart:gateway-users');

const database = require('../../etc/sequelize').database;

/**
 * Get all users
 */
router.get('/', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
});

/**
 * Get one user
 */
router.get('/:id', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
});

/**
 * Create one user
 */
router.post('/', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
});

/**
 * Replace an existing user
 */
router.put('/:id', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
});

/**
 * Modify an existing user
 */
router.patch('/:id', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
});

/**
 * Delete one user
 */
router.delete('/:id', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
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
