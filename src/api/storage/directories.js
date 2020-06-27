const router = require('express').Router();
const debug = require('debug')('quickstart:api-directories');
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
 * Find all children directories of a given directoryid
 * Does not find grandchild
 *
 * @params {number} id - The directoryid to query
 * @return {object[]} directory[] - Returns an array of directories
 */
router.get('/:id/children', (req, res, next) => {
    var parentid = req.params.id;
    database.sequelize
        .query(
            'SELECT dir.directoryid AS id, dir.directoryname AS text, true AS children ' +
            'FROM directories AS dir, ' +
            '(SELECT directoryname, groupname FROM directories WHERE directoryid = ?) AS parent ' +
            'WHERE dir.groupname = parent.groupname ' + // Same group
            'AND dir.directoryname <@ parent.directoryname ' + // Filter descendants
            'AND nlevel(dir.directoryname) = (nlevel(parent.directoryname) + 1) ' + // Filter children (Non-recursive descendants)
            'AND dir.directoryname != parent.directoryname ' +
            'ORDER BY text ASC;',
            {
                replacements: [parentid],
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
 * Find all descendants of a given directoryid
 *
 * @params {number} id - The directoryid to query
 * @return {object[]} directory[] - Returns an array of directories
 */
router.get('/:id/descendants', (req, res, next) => {
    var parentid = req.params.id;
    database.sequelize
        .query(
            'SELECT dir.directoryid AS id, dir.directoryname AS text, true AS children ' +
            'FROM directories AS dir, ' +
            '(SELECT directoryname, groupname FROM directories WHERE directoryid = ?) AS parent ' +
            'WHERE dir.groupname = parent.groupname ' + // Same group
            'AND dir.directoryname <@ parent.directoryname ' + // Filter descendants
            'AND dir.directoryname != parent.directoryname ' +
            'ORDER BY text ASC;',
            {
                replacements: [parentid],
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
    model: database.directories,
    endpoints: ['/', '/:directoryid'],
    associations: true,
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
    const directoryname = req.body.directoryname;
    const groupname = req.body.groupname;
    // Ensure required fields
    if (!directoryname || !groupname) {
        send400(res, new Error('Empty fields'));
        return context.stop;
    }
    // Cannot create top level directory
    if (isValidTopLevel.test(directoryname)) {
        send400(res, new Error('Cannot create top level directory'));
        return context.stop;
    }
    // Check directory name is valid (regex test)
    if (!isValidNonTopLevel.test(directoryname)) {
        send400(res, new Error('Invalid directory name'));
        return context.stop;
    }
    // Check parent directory exists
    const result = await database.directories
        .findOne({
            where: {
                directoryname: dirPattern.exec(directoryname)[1],
                groupname: groupname,
            },
        })
        .catch((error) => { // result will be undefined if the promise is rejected
            send500(res, error);
        });
    if (result === undefined) return context.stop;
    if (!result) {
        send400(res, new Error('New directory must be child of existing directory'));
        return context.stop;
    }
    // Proceed with next milestone
    return context.continue;
    // Skip creating of physical directory (lazy)
});

/**
 * Perform validation before PUT (update), fetching as required
 *
 * Required fields: directoryid
 * Optional fields: directoryname, groupname
 */
resource.update.fetch.after(async (req, res, context) => {
    // context.instance is only available after fetch. Hence we use fetch.after
    const directoryid = req.params.directoryid;
    const olddirectoryname = context.instance.directoryname;
    const oldgroupname = context.instance.groupname;
    // ID cannot be changed
    if (req.body.directoryid && req.body.directoryid !== directoryid) {
        send400(res, new Error('Cannot change directory id'));
        return context.stop;
    }
    // Optional fields
    const newdirectoryname = (req.body.directoryname) ? req.body.directoryname : olddirectoryname;
    const newgroupname = (req.body.groupname) ? req.body.groupname : oldgroupname;
    // Values unchanged, nothing to do
    if (olddirectoryname === newdirectoryname && oldgroupname === newgroupname) {
        res.status(201).send(context.instance);
        return context.stop;
    }
    // Cannot rename to/from top level directory
    if (isValidTopLevel.test(olddirectoryname) || isValidTopLevel.test(newdirectoryname)) {
        send400(res, new Error('Cannot rename to/from top level directory'));
        return context.stop;
    }
    // New directory is a valid ltree name
    if (!isValidNonTopLevel.test(newdirectoryname)) {
        send400(res, new Error('Invalid directory name'));
        return context.stop;
    }
    // Cannot create directory loop
    var oldpattern = '^' + olddirectoryname.replace(/\./g, '\\.') + '\\.';
    if (newdirectoryname.search(oldpattern) === 0) {
        send400(res, new Error('Directory cannot be child of itself'));
        return context.stop;
    }
    // Parent directory must exist
    const result = await database.directories
        .findOne({
            where: {
                directoryname: dirPattern.exec(newdirectoryname)[1],
                groupname: newgroupname,
            },
        })
        .catch((error) => { // result will be undefined if the promise is rejected
            send500(res, error);
        });
    if (result === undefined) return context.stop;
    if (!result) {
        send400(res, new Error('Parent directory or Groupname does not exist'));
        return context.stop;
    }
    // Proceed on milestone
    return context.continue;
});

/**
 * Modify existing directory and cascade to subdirectories
 * Also moves physical folders accordingly
 */
resource.update.write.before((req, res, context) => {
    const directoryid = req.params.directoryid;
    const olddirectoryname = context.instance.directoryname;
    const oldgroupname = context.instance.groupname;
    // Optional fields
    const newdirectoryname = (req.body.directoryname) ? req.body.directoryname : olddirectoryname;
    const newgroupname = (req.body.groupname) ? req.body.groupname : oldgroupname;

    database.sequelize.transaction(async (t) => {
        const oldgroup = await context.instance.getGroup();
        const newgroup = await database.groups.findByPk(newgroupname);
        // Update directoryname and groupname
        await context.instance.update( // Update = set + save
            {
                directoryname: newdirectoryname,
                groupname: newgroupname,
            },
            { transaction: t }
        );
        // Recursively change subdirectory's directoryname and groupname
        await database.sequelize.query(
            'UPDATE directories ' +
                'SET groupname = ?, ' +
                'directoryname = ? || subpath(directoryname, nlevel(?)) ' +
                'WHERE groupname = ? AND directoryname <@ ?;',
            {
                replacements: [
                    newgroupname,
                    newdirectoryname,
                    olddirectoryname,
                    oldgroupname,
                    olddirectoryname,
                ],
                transaction: t,
            }
        );
        // Move physical folders accordingly
        const oldPath = file_storage_path + oldgroup.groupid
            + '/' + olddirectoryname.replace(/\./g, '/');
        const newPath = file_storage_path + newgroup.groupid
            + '/' + newdirectoryname.replace(/\./g, '/');
        if (fs.existsSync(oldPath)) {
            await fs.move(oldPath, newPath);
        }
    })
    .then(() => {
        // Skip finale's default write function
        context.skip();
    })
    .catch((error) => {
        send500(res, error);
        context.stop();
    });
});

// Validate fields, fetching as required
resource.delete.fetch.after((req, res, context) => {
    // Cannot delete top level directory
    if (isValidTopLevel.test(context.instance.directoryname)) {
        send400(res, new Error('Cannot delete top level directory'));
        return context.stop;
    }
    // Proceed to next milestone
    return context.continue;
});

/**
 * Delete directory and cascade to subdirectories
 * Also removes corresponding physical folders
 */
resource.delete.write.before((req, res, context) => {
    const directory = context.instance;
    const directoryname = directory.directoryname;
    const groupname = directory.groupname;

    // Perform both operations as a single transaction
    database.sequelize.transaction(async (t) => {
        // Delete directory and all subdirectories
        const result = await database.sequelize.query(
            'DELETE FROM directories WHERE groupname = ? AND directoryname <@ ?;',
            {
                replacements: [groupname, directoryname],
                transaction: t,
            }
        );
        // Delete corresponding folders
        const group = await directory.getGroup();
        const dirPath = file_storage_path + group.groupid
            + '/' + directoryname.replace(/\./g, '/');
        await fs.remove(dirPath);
        // Return delete result
        return result;
    })
    .then(([result, metadata]) => {
        res.status(200).send({
            message: metadata.rowCount + ' rows deleted',
            rows: metadata.rowCount,
        });
        context.stop();
    })
    .catch((error) => {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            send400(res, new Error('Directory contains a file'));
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
