const router = require('express').Router();
const debug = require('debug')('quickstart:api-directories');
const finale = require('finale-rest');
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');

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
            'SELECT dir.directoryid, dir.directoryname, dir.groupname ' +
            'FROM directories AS dir, ' +
            '(SELECT directoryname, groupname FROM directories WHERE directoryid = ?) AS parent ' +
            'WHERE dir.groupname = parent.groupname ' + // Same group
            'AND dir.directoryname <@ parent.directoryname ' + // Filter descendants
            'AND nlevel(dir.directoryname) = (nlevel(parent.directoryname) + 1) ' + // Non-recursive descendants
                'AND dir.directoryname != parent.directoryname;',
            {
                replacements: [parentid],
                type: QueryTypes.SELECT,
            }
        )
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            debug(error);
            res.status(500).send({
                message: 'internal error',
                errors: [error.constructor.name],
            });
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
            'SELECT dir.directoryid, dir.directoryname, dir.groupname ' +
            'FROM directories AS dir, ' +
            '(SELECT directoryname, groupname FROM directories WHERE directoryid = ?) AS parent ' +
            'WHERE dir.groupname = parent.groupname ' + // Same group
            'AND dir.directoryname <@ parent.directoryname ' + // Filter descendants
                'AND dir.directoryname != parent.directoryname;',
            {
                replacements: [parentid],
                type: QueryTypes.SELECT,
            }
        )
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            debug(error);
            res.status(500).send({
                message: 'internal error',
                errors: [error.constructor.name],
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
    model: database.directories,
    endpoints: ['/', '/:directoryid'],
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
        errors: error,
    });
    return;
}

resource.create.write.before((req, res, context) => {
    var directoryname = req.body.directoryname;
    var groupname = req.body.groupname;
    if (!directoryname || !groupname) {
        send400(res, ['Empty fields']);
        context.stop();
        return;
    }
    // Check new directory is a child of existing directory
    // 1. Cannot create top level directory
    // 2. Check directory is a valid ltree non-toplevel name
    // 3. Check parent directory exists
    if (isValidTopLevel.test(directoryname)) {
        send400(res, ['Cannot create top level directory']);
        context.stop();
        return;
    }
    if (!isValidNonTopLevel.test(directoryname)) {
        send400(res, ['Invalid directory name']);
        context.stop();
        return;
    }
    database.directories
        .findOne({
            where: {
                directoryname: dirPattern.exec(directoryname)[1],
                groupname: groupname,
            },
        })
        .then((result) => {
            if (!result) {
                send400(res, [
                    'New directory must be child of existing directory',
                ]);
                context.stop();
                return;
            } else {
                // Directory name is valid
                // Let finale handle the creation
                context.continue();
            }
        })
        .catch((error) => {
            debug(error);
            res.status(500).send({
                message: 'internal error',
                errors: [error.name],
            });
            context.stop();
        });
});

resource.update.write.before((req, res, context) => {
    const directoryid = req.params.directoryid;
    const newdirectoryname = req.body.directoryname;
    const newgroupname = req.body.groupname;
    if (
        req.body.directoryid &&
        req.body.directoryid !== req.params.directoryid
    ) {
        return send400(res, ['Cannot change directory id']);
    }
    // Ensure fields are not empty
    if (!newdirectoryname || !newgroupname) {
        return send400(res, ['Empty fields']);
    }
    database.directories
        .findByPk(directoryid)
        .then((directory) => {
            if (!directory) {
                return send400(res, ['Directory does not exist']);
            }
            var olddirectoryname = directory.directoryname;
            var oldgroupname = directory.groupname;
            // 1. Cannot rename to/from top level directory
            if (
                isValidTopLevel.test(olddirectoryname) ||
                isValidTopLevel.test(newdirectoryname)
            ) {
                return send400(res, [
                    'Cannot rename to/from top level directory',
                ]);
            }
            // 2. New directory is a valid ltree name
            if (!isValidNonTopLevel.test(newdirectoryname)) {
                return send400(res, ['Invalid directory name']);
            }
            // 3. Cannot create directory loop
            var str = ('' + olddirectoryname).replace('.', '\\.');
            if (newdirectoryname.search(str + '\\.') === 0) {
                return send400(res, ['Directory cannot be child of itself']);
            }
            // 4. New directory name must be child of existing directory
            database.directories
                .findOne({
                    where: {
                        directoryname: dirPattern.exec(newdirectoryname)[1],
                        groupname: newgroupname,
                    },
                })
                .then((result) => {
                    if (!result) {
                        return send400(res, [
                            'New directory name must be child of existing directory',
                            'Groupname must exist',
                        ]);
                    }

                    return database.sequelize.transaction(async (t) => {
                        // Update directoryname and groupname
                        await directory.update(
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
                                'WHERE directoryname <@ ? AND groupname = ?;',
                            {
                                replacements: [
                                    newgroupname,
                                    newdirectoryname,
                                    olddirectoryname,
                                    olddirectoryname,
                                    oldgroupname,
                                ],
                                transaction: t,
                            }
                        );
                    });
                })
                .then(() => {
                    res.status(201).send({
                        directoryid: directoryid,
                        directoryname: newdirectoryname,
                        groupname: newgroupname,
                    });
                });
        })
        .catch((error) => {
            debug(error);
            res.status(500).send({
                message: 'internal error',
                errors: [error.name],
            });
        });
    context.stop();
});

resource.delete.write.before((req, res, context) => {
    const directoryid = req.params.directoryid;
    // Obtain directoryname and groupname from directoryid
    database.directories
        .findOne({
            where: {
                directoryid: directoryid,
            },
        })
        .then((directory) => {
            const directoryname = directory.directoryname;
            const groupname = directory.groupname;
            // Cannot delete top level directory
            if (isValidTopLevel.test(directoryname)) {
                send400(res, ['Cannot delete top level directory']);
                return;
            }
            // Delete directory and all subdirectories
            database.sequelize
                .query(
                    'DELETE FROM directories WHERE groupname = ? AND directoryname <@ ?;',
                    {
                        replacements: [groupname, directoryname],
                    }
                )
                .then(
                    ([result, metadata]) => {
                        res.status(200).send({
                            message: metadata.rowCount + ' rows deleted',
                        });
                    },
                    (error) => {
                        debug(error);
                        res.status(500).send({
                            message: 'internal error',
                            errors: [error.name],
                        });
                    }
                );
        });
    context.stop();
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
