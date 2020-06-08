const router = require('express').Router();
const debug = require('debug')('quickstart:gateway-groups');

const database = require('../../database').database;

// Deletable: STATUS CODE REFERENCE
// https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design#define-operations-in-terms-of-http-methods

// TODO: Decide on error message
// Should we show the classname of error message or show a generic message?

/**
 * Get all groups
 */
router.get('/', (req, res, next) => {
    // Todo: Check user has user_mgmt_priv
    database.groups
        .findAll()
        .then( groups => { res.send(groups); })
        .catch( err => { 
            //debug(err);
            debug(Object.getPrototypeOf(err).constructor.name);
            res.status(500).send({ message: 'An error has occurred' });
        });
});

/**
 * Get one group
 */
router.get('/:id', (req, res, next) => {
    // Todo: Check user has user_mgmt_priv
    database.groups
        .findByPk(req.params.id)
        .then( group => { res.send(group); })
        .catch( err => { 
            //debug(err);
            debug(Object.getPrototypeOf(err).constructor.name);
            res.status(500).send({ message: 'An error has occurred' });
        });
});

/**
 * Create one group
 */
router.post('/', (req, res, next) => {
    // Todo: Check user has user_mgmt_priv
    
    // Variables
    var groupname = req.body.groupname;
    var supergroup = req.body.supergroup;

    // Input Checking (Short of input validation)
    if (!groupname || !supergroup) {
        return res.status(400).send({ message: 'Fields cannot be empty' });
    }
    if (groupname === supergroup) {
        return res.status(400).send({ 
            message: 'Cannot be supergroup of itself' 
        });
    }

    // Attempt to create group in database
    database.groups
        .findOrCreate({ where: req.body })
        .then(([group, created]) => {
            if (!created) {
                return res.status(400).send({ message: 'Duplicate group name'});
            }
            res.status(201).send(group);
        })
        .catch((err) => {
            //debug(err);
            debug(Object.getPrototypeOf(err).constructor.name);
            res.status(500).send({ message: Object.getPrototypeOf(err).constructor.name });
        });
});

/**
 * Update one group
 */
router.put('/', (req, res, next) => {
    // TODO: 501 unimplemented
    res.status(501).send();
});


/**
 * Delete one group
 */
router.delete('/:id', (req, res, next) => {
    // Todo: Check user has user_mgmt_priv
    
    // TODO: Prevent deletion of root group
    // https://stackoverflow.com/questions/810180/how-to-prevent-deletion-of-the-first-row-in-table-postgresql

    // Attempt to remove row in database
    database.groups
        .destroy({ where: {groupname: req.params.id} })
        .then( numRowsDeleted => { 
            // Failure
            if (numRowsDeleted === 0) {
                return res.status(400).send({ message: 'Group does not exist'});
            }
            // Success
            res.send("" + numRowsDeleted);
        })
        .catch( err => {
            //debug(err);
            debug(Object.getPrototypeOf(err).constructor.name);
            res.status(500).send({ message: Object.getPrototypeOf(err).constructor.name });
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