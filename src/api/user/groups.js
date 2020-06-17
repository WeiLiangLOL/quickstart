const router = require('express').Router();
const debug = require('debug')('quickstart:api-groups');
const finale = require('finale-rest');
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');

const database = require('../../../etc/sequelize').database;

const isValidTopLevel = /^\w+$/;
const isValidNonTopLevel = /^\w+\.[\.\w]*\w+$/;
const basePattern = /\.?(\w+)$/;
const dirPattern = /([\w\.]+)\.\w+$/;

/**
 * Find all subgroups of a given groupname
 *
 * @params {string} id - The groupname to query
 * @return {string[]} - Returns an array containing all subgroups
 */
router.get('/:id/subgroups', (req, res, next) => {
    var groupname = req.params.id;
    database.sequelize.query(
        'SELECT groupname from groups where groupname <@ ? AND groupname != ?',
        {
            replacements: [groupname, groupname],
            type: QueryTypes.SELECT
        }
    ).then((results) => {
        res.send(results);
    }).catch((error) => {
        debug(error);
        res.status(500).send({
            message: 'internal error',
            errors: [error.constructor.name]
        });
    });
});

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

/**
 * Convenience function
 * Send a status 400 response with corresponding error
 */
function send400(res, error) {
    debug(error);
    res.status(400).send({
        message: 'bad request',
        errors: error
    });
}

/**
 * Modify a groupname
 * Specify old groupname in request parameters
 * Specify new groupname in request body
 *
 * Shortcomings:
 * 1. Does not create group if not exist
 * 2. Totally not idempotent
 */
resource.update.write.before((req, res, context) => {
    var oldname = req.params.groupname;
    var newname = req.body.groupname;

    // Validate input before modifying groupname
    // 1. Cannot rename to/from top level
    // 2. Groupname must be a valid ltree path
    // 3. Cannot create parent-child loop
    // 4. New group must be a child of existing group
    if (!oldname || !newname) {
        send400(res, ['Missing required fields']);
        context.stop();
        return;
    }
    // Check if renaming top level
    if (isValidTopLevel.test(oldname) || isValidTopLevel.test(newname)) {
        send400(res, ['Cannot rename to/from top level']);
        context.stop();
        return;
    }
    // Check rename is valid
    if (!isValidNonTopLevel.test(oldname) || !isValidNonTopLevel.test(newname)) {
        // Invalid ltree rename
        send400(res, ['Invalid groupname']);
        context.stop();
        return;
    }
    // Invalid: Setting parentnode as a child of parent's childnode
    var str = ('' + oldname).replace('.', '\\.');
    if (newname.search(str + '\\.') === 0) {
        send400(res, ['Group cannot be child of itself']);
        context.stop();
        return;
    }
    // First check newname is child of an existing group
    database.groups.findOne({
        where: { groupname: dirPattern.exec(newname)[1] }
    }).then((result) => {
        // Not a child of existing group
        if (!result) {
            send400(res, ['New groupname must extend an existing group']);
            context.stop();
            return;
        }

        // All checks passed

        // Sequelize does not allow changing of primarykey So we will do it ourself
        // 1. Change the Groupname
        // 2. Propagate the change to subgroups
        database.sequelize.transaction(async (t) => {
            // Rename group
            await database.sequelize.query(
                'UPDATE groups SET groupname = ? where groupname = ?',
                {
                    replacements: [newname, oldname],
                    type: QueryTypes.UPDATE,
                    transaction: t
                }
            );
            // Rename subgroups
            await database.sequelize.query(
                'UPDATE groups SET groupname = ? || subpath(groupname, nlevel(?)) where groupname <@ ?;',
                {
                    replacements: [newname, oldname, oldname],
                    type: QueryTypes.UPDATE,
                    transaction: t
                }
            );
        }).then(() => {
            res.status(201).send({ message: newname });
            context.stop();
        }).catch((error) => {
            if (error.constructor.name === 'UniqueConstraintError'){
                send400(res, ['Groupname has been taken']);
            } else {
                debug(error);
                res.status(500).send({ message: 'internal error', errors: [error.constructor.name]});
            }
            context.stop();
        });
    });
});

/**
 * Creates a group and also create the top level directory for that group
 * Both operations are done in a single database transaction
 *
 * Does not allow creating duplicates, hence is idempotent
 */
resource.create.write.before((req, res, context) => {

    // Validate input before creating group
    // 1. Cannot create top level groups
    // 2. Groupname must be a valid ltree path
    // 3. New group must be a child of an existing group
    const groupname = req.body.groupname;
    // Cannot create top level group
    if (isValidTopLevel.test(groupname)) {
        send400(res, ['Cannot create top level group']);
        context.stop();
        return;
    }
    // Invalid groupname
    if (!isValidNonTopLevel.test(groupname)) {
        send400(res, ['Invalid groupname']);
        context.stop();
        return;
    }
    // Check that group must be a child of an existing group
    database.groups.findOne({
        where: { groupname: dirPattern.exec(groupname)[1] }
    }).then((result) => {
        // Not a child of existing group
        if (!result) {
            send400(res, ['New group must extend an existing group']);
            context.stop();
            return;
        }

        // All checks passed
        // Create group and top level file directory
        create(req, res, context);
    });
});

/**
 * Create a group and the top directory of the groups
 * Operation is performed as a single database transaction
 */
async function create(req, res, context) {
    try {
        // Create a group and the group's top level directory together as a single database transaction
        const result = await database.sequelize.transaction(async (t) => {
            const group = await database.groups.create(req.body, { transaction: t });
            await group.createDirectory({ directoryname: 'root' }, { transaction: t });
            return group;
        });
        res.status(201).send(result.dataValues);
    } catch (error) {
        if (error.constructor.name === 'UniqueConstraintError'){
            send400(res, ['Groupname has been taken']);
        } else {
            debug(error);
            res.status(500).send({ message: 'internal error', errors: [error.constructor.name]});
        }
    }
    context.stop();
}

/**
 * All directories related to this group will be deleted (by db constraint)
 * Operation fails if there exists one file owned by group (by db constraint)
 */
resource.delete.write.before((req, res, context) => {

    // Validate input before performing delete
    // 1. Cannot delete top level group
    // 2. Groupname must be a valid ltree path
    // 3. Group cannot have children
    const groupname = req.params.groupname;
    // Cannot delete top level group
    if (isValidTopLevel.test(groupname)) {
        send400(res, ['Cannot delete top level group']);
        context.stop();
        return;
    }
    // Invalid groupname
    if (!isValidNonTopLevel.test(groupname)) {
        send400(res, ['Invalid groupname']);
        context.stop();
        return;
    }
    // Cannot delete group that has children
    database.sequelize.query(
        'select true from groups where groupname <@ ? and groupname != ? limit 1',
        { replacements: [groupname, groupname], type: QueryTypes.SELECT }
    ).then((result) => {
        // Has children
        if (result.length > 0) {
            send400(res, ['Cannot delete group that has children']);
            context.stop();
            return;
        }

        // All checks passed, Safe to delete
        // Database foreignkey constraints will take care of deleting
        // all directories associated with this group
        context.continue(); // Leave it to finale
    });

});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
