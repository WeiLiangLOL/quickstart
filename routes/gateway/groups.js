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
        .then(groups => { res.send(groups); })
        .catch(err => { 
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
        .then(group => { res.send(group); })
        .catch(err => { 
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
 * Create or Replaces one group
 *
 * This request is idempotent
 * Must specify all fields in http body
 */
router.put('/:id', (req, res, next) => {
    // Todo: Check user has user_mgmt_priv
    
    // Variables
    var newGroupName = req.body.groupname;
    var newSuperGroup = req.body.supergroup;
    
    // Basic input check
    if (!newGroupName || !newSuperGroup) {
        return res.status(400).send("Empty Fields");
    }
    if (newGroupName === newSuperGroup) {
        return res.status(400).send("Groupname cannot be same as supergroup");
    }
    
    // TODO NOTE: This oop method doesn't work because
    // Sequelize does not allow update of primary key (groupname)
    /*database.groups
        .findByPk(req.params.id)
        .then(group => {
            group.update({
                groupname: newGroupName,
                supergroup: newSuperGroup
            });
            res.send("okay");
        });
    */
    
    // TODO Note: First database query works, second database undone
    // Attempt to modify, creating if does not exist
    /*database.groups
        .update({ 
                groupname: newGroupName,
                supergroup: newSuperGroup
        }, { where: { groupname: req.params.id }
        }).then(result => {
            var success = !!result[0]; // Convert integer to boolean
            // Success
            if (success) return res.send(success);
            
            // TODO Note: Second part undone
            // Failure, proceed to create
            database.groups
                .findOrCreate({
                    where: {
                        
                    }, 
                    defaults: {
                        groupname: newGroupName,
                        supergroup: newSuperGroup
                    }
                })
        }).catch(err => {
            res.send(Object.getPrototypeOf(err).constructor.name);
        });*/
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