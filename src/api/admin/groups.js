const router = require('express').Router();
const debug = require('debug')('quickstart:api-groups');
const finale = require('finale-rest');
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');
// For creating group's folder
const { file_storage_path } = require('../../../etc/config');
const fs = require('fs-extra');

const database = require('../../../etc/sequelize').database;

const isValidTopLevel = /^\w+$/;
const isValidNonTopLevel = /^\w+\.[\.\w]*\w+$/;
const basePattern = /\.?(\w+)$/;
const dirPattern = /([\w\.]+)\.\w+$/;

/**
 * Find all children groups of a given groupname
 * Does not find grandchild
 *
 * @params {string} id - The groupname to query
 * @return {object[]} group[] - Returns an array of groups
 */
router.get('/:id/children', (req, res, next) => {
    var groupname = req.params.id;
    database.sequelize
        .query(
            'SELECT groupname FROM groups ' +
            'WHERE groupname <@ ? ' + // Filter descendants
            'AND nlevel(groupname) = (nlevel(?) + 1) ' + // Non-recursive
                'AND groupname != ?;',
            {
                replacements: [groupname, groupname, groupname],
                type: QueryTypes.SELECT,
            }
        )
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            send500(res, error);
        });
});

/**
 * Find all descendants of a given groupname
 *
 * @params {string} id - The groupname to query
 * @return {object[]} group[] - Returns an array of groups
 */
router.get('/:id/descendants', (req, res, next) => {
    var groupname = req.params.id;
    database.sequelize
        .query(
            'SELECT groupname FROM groups ' +
                'WHERE groupname <@ ? ' +
                'AND groupname != ?;',
            {
                replacements: [groupname, groupname],
                type: QueryTypes.SELECT,
            }
        )
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            send500(res, error);
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
 * Use error 400 to flag expected behaviors
 */
function send400(res, error) {
    debug(error.message);
    res.status(400).send({
        message: 'bad request',
        errors: [error.message],
    });
    return;
}

/**
 * Use error 500 for unexpected errors
 */
function send500(res, error) {
    debug(error);
    res.status(500).send({
        message: 'internal error',
        errors: [error.name],
    });
    return;
}

// Validate fields before POST (create), fetching as required
resource.create.fetch(async (req, res, context) => {
    const groupname = req.body.groupname;
    // Cannot create top level group
    if (isValidTopLevel.test(groupname)) {
        send400(res, new Error('Cannot create top level group'));
        return context.stop;
    }
    // Invalid groupname (regex pattern check)
    if (!isValidNonTopLevel.test(groupname)) {
        send400(res, new Error('Invalid groupname'));
        return context.stop;
    }
    // Check that new groupname must be a child of an existing group
    const parent = await database.groups
        .findOne({ where: { groupname: dirPattern.exec(groupname)[1] } })
        .catch((error) => {
            // parent will be undefined if the promise is rejected
            send500(res, error);
        });
    if (parent === undefined) return context.stop;
    if (!parent) {
        send400(res, new Error('New group must extend an existing group'));
        return context.stop;
    }
    // Proceed on milestone
    return context.continue;
});

/**
 * Creates a group and the necessary resources
 */
resource.create.write.before((req, res, context) => {
    // Perform the following as a single transaction
    database.sequelize
        .transaction(async (t) => {
            // Create database group
            const group = await database.groups.create(req.body, {
                transaction: t,
            });
            // Create database directory
            await group.createDirectory(
                { directoryname: 'root' },
                { transaction: t }
            );
            // Create physical folder
            await fs.ensureDir(file_storage_path + group.groupid);
            // Transactions will rollback if any of the above fails
            return group;
        })
        .then((result) => {
            // Save created object into context (used by finalejs)
            context.instance = result.dataValues;
            // Skip finale's default write function
            context.skip();
        })
        .catch((error) => {
            send500(res, error);
            context.stop();
        });
});

// Validate fields before PUT (update), fetching as required
resource.update.fetch.before(async (req, res, context) => {
    var oldname = req.params.groupname;
    var newname = req.body.groupname;
    // Check fields not empty
    if (!oldname || !newname) {
        send400(res, new Error('Missing required fields'));
        return context.stop;
    }
    // Prevent renaming to/from top level group
    if (isValidTopLevel.test(oldname) || isValidTopLevel.test(newname)) {
        send400(res, new Error('Cannot rename to/from top level'));
        return context.stop;
    }
    // Check names are valid (regex test)
    if (
        !isValidNonTopLevel.test(oldname) ||
        !isValidNonTopLevel.test(newname)
    ) {
        send400(res, new Error('Invalid groupname'));
        return context.stop;
    }
    // Prevent parent-child loop
    const oldnamepattern = '^' + oldname.replace(/\./g, '\\.') + '\\.';
    if (newname.search(oldnamepattern) === 0) {
        send400(res, new Error('Group cannot be child of itself'));
        return context.stop;
    }
    // Check newname is child of an existing group
    const parent = await database.groups
        .findOne({
            where: {
                groupname: dirPattern.exec(newname)[1],
            },
        })
        .catch((error) => {
            // parent will be undefined if the promise is rejected
            send500(res, error);
        });
    if (parent === undefined) return context.stop;
    if (!parent) {
        send400(res, new Error('New groupname must extend an existing group'));
        return context.stop;
    }
    // Proceed with next milestone
    return context.continue;
});

/**
 * Modify a groupname. Changes will cascade to subgroups accordingly
 */
resource.update.write.before((req, res, context) => {
    var oldname = req.params.groupname;
    var newname = req.body.groupname;
    // Perform all operations in a single transaction
    database.sequelize
        .transaction(async (t) => {
            // Rename group
            // Sequelize does not allow rename of primary key, so we do it ourselves
            await database.sequelize.query(
                'UPDATE groups SET groupname = ? where groupname = ?',
                {
                    replacements: [newname, oldname],
                    type: QueryTypes.UPDATE,
                    transaction: t,
                }
            );
            // Rename subgroups
            // Code from: http://patshaughnessy.net/2017/12/14/manipulating-trees-using-sql-and-the-postgres-ltree-extension
            await database.sequelize.query(
                'UPDATE groups SET groupname = ? || subpath(groupname, nlevel(?)) where groupname <@ ?;',
                {
                    replacements: [newname, oldname, oldname],
                    type: QueryTypes.UPDATE,
                    transaction: t,
                }
            );
            // Physical folders use groupid, nothing to do

            // Update instance with new name
            context.instance = {
                groupname: newname,
                groupid: context.instance.groupid,
            };
            // Skip finale's default write function
            context.skip();
        })
        .catch((error) => {
            send500(res, error);
            context.stop();
        });
});

// Validate fields before DELETE, fetching as required
resource.delete.fetch.before(async (req, res, context) => {
    const groupname = req.params.groupname;
    // Cannot delete top level group
    if (isValidTopLevel.test(groupname)) {
        send400(res, new Error('Cannot delete top level group'));
        return context.stop;
    }
    // Check name is valid (regex test)
    if (!isValidNonTopLevel.test(groupname)) {
        send400(res, new Error('Invalid groupname'));
        return context.stop;
    }
    // Cannot delete group that has children
    const result = await database.sequelize
        .query(
            'select true from groups where groupname <@ ? and groupname != ? limit 1',
            {
                replacements: [groupname, groupname],
                type: QueryTypes.SELECT,
            }
        )
        .catch((error) => {
            // result will be undefined if the promise is rejected
            send500(res, error);
        });
    if (result === undefined) return context.stop;
    if (result.length > 0) {
        send400(res, new Error('Cannot delete group that has children'));
        return context.stop;
    }
    // Proceed with next milestone
    return context.continue;
});

/**
 * Deletes a group and its folders
 * A group cannot be deleted if it has a file (by database constraint)
 */
resource.delete.write.before((req, res, context) => {
    // Database foreignkey constraints will take care of deleting
    // all directories associated with this group
    database.sequelize
        .transaction(async (t) => {
            const groupid = context.instance.groupid;
            // Delete group
            await context.instance.destroy({
                transaction: t,
            });
            // Delete physical folder, recursive
            await fs.remove(file_storage_path + groupid);
            // Skip finale's default write function
            context.skip();
        })
        .catch((error) => {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                send400(res, new Error('Group has a file'));
            } else {
                send500(res, error);
            }
            context.stop();
        });
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
