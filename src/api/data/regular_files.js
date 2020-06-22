const router = require('express').Router();
const debug = require('debug')('quickstart:api-regular_files');
const finale = require('finale-rest');
const { file_storage_path } = require('../../../etc/config');
const upload  = require('multer')({ dest: file_storage_path + 'tmp/' });
const fs = require('fs-extra');

const database = require('../../../etc/sequelize').database;

// Middleware, puts uploaded file into req.file
// Use name='file' in html form
// req.file = { fieldname, originalname, encoding, mimetype, size, destination, filename, path, buffer }
router.use(upload.single('file'));

// Initialize finale
finale.initialize({
    app: router,
    sequelize: database.sequelize,
});

// Create REST resource
const resource = finale.resource({
    model: database.regular_files,
    endpoints: ['/', '/:fileid'],
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

/**
 * Generate the relative file path from directoryid and filename
 *
 * @returns {promise} Evalutes to the relative file path or
 *                    null if directoryid does not exist
 * @throws Sequelize error
 */
function getFilePath(directoryid, filename) {
    // Obtain groupid and directoryname
    return database.directories
        .findByPk(directoryid, { include: database.groups })
        .then((dir) => {
            if (!dir) {
                return null;
            }
            // Warning: Do we need to escape filename
            return file_storage_path + dir.group.groupid
                + '/' + dir.directoryname.replace(/\./g, '/')
                + '/' + filename;
        });
}

// Retrieve the file and send to client
router.use('/:id/download', (req, res, next) => {

});

/**
 * Validate fields
 * Required fields: file, directoryid, owner
 * Optional fields: islocked
 * Overwritten fields: created_at, updated_at, filename, filesize
 */
resource.create.fetch(async (req, res, context) => {
    // No file uploaded
    if (!req.file) {
        send400(res, new Error('No file uploaded'));
        return context.stop;
    }
    // Empty fields
    if (!req.body.directoryid || !req.body.owner) {
        send400(res, new Error('Empty fields'));
        return context.stop;
    }
    // islocked defaults to false
    req.body.islocked = (req.body.islocked) ? req.body.islocked : false;
    // Populate req.body
    req.body.filename = req.file.originalname;
    req.body.filesize = req.file.size;

    // Store paths in res.locals
    res.locals.tmpPath = req.file.path;
    res.locals.newPath = await getFilePath(req.body.directoryid, req.file.originalname)
        .catch((error) => { // res.locals.newPath will be undefined if error
            send500(res, error);
        });
    if (res.locals.newPath === undefined) return context.stop;
    if (!res.locals.newPath) {
        send400(res, new Error('Directoryid does not exist'));
        return context.stop;
    }

    // Note: 'Owner' field is not checked.
    // We let database foreignkey constraint handle it
    return context.continue;
});

/**
 * Creates regular_file metadata.
 * File is stored in folder specified by directoryid
 */
resource.create.write.before((req, res, context) => {
    // Perform operations as a single transaction
    return database.sequelize
        .transaction(async (t) => {
            // Create regular_file metadata
            context.instance = await database.regular_files.create(req.body, { transaction: t });
            // Store file in folder as specified by directoryid
            await fs.move(res.locals.tmpPath, res.locals.newPath); // Creates dir if not exist
        })
        .then(() => {
            // Skip finale's default create function
            return context.skip;
        })
        .catch((error) => {
            // Delete uploaded file and send error
            fs.remove(res.locals.tmpPath);
            send500(res, error);
            return context.stop;
        });
});

/**
 * Transform the database data
 *
 * Required field: fileid
 * Optional fields: file, directoryid, owner, islocked, filename
 */
resource.update.data(async (req, res, context) => {

    // Obtain old pathname and store into res.locals
    res.locals.oldPath = await getFilePath(context.instance.directoryid, context.instance.filename)
        .catch((error) => {
            send500(res, error);
        });
    if (res.locals.oldPath === undefined) return context.stop;
    if (!res.locals.oldPath) {
        send500(res, new Error('directoryid does not exist')); // Cannot be the case, so we use error 500
        return context.stop;
    }

    // Modify the context
    if (req.body.directoryid) context.instance.directoryid = req.body.directoryid;
    if (req.body.owner) context.instance.owner = req.body.owner;
    if (req.body.islocked) context.instance.islocked = req.body.islocked;
    if (req.body.filename) context.instance.filename = req.body.filename;

    // Obtain new pathname and store into res.locals
    res.locals.newPath = await getFilePath(context.instance.directoryid, context.instance.filename)
        .catch((error) => {
            send500(res, error);
        });
    if (res.locals.newPath === undefined) return context.stop;
    if (!res.locals.newPath) {
        send400(res, new Error('directoryid does not exist'));
        return context.stop;
    }

    // Proceed with next milestone
    return context.continue;
});

resource.update.write.before((req, res, context) => {
    return Promise.resolve()
        .then(() => {
            // Case 1: No replacement file
            if (!req.file) {
                return database.sequelize
                    .transaction(async (t) => {
                        // Update the database
                        await context.instance.save({ transaction: t });
                        // Move file from oldpath to newpath
                        if (res.locals.oldPath != res.locals.newPath) {
                            await fs.move(res.locals.oldPath, res.locals.newPath);
                        }
                    });
            // Case 2: Has replacement file (stored in res.locals.tmpPath)
            } else {
                return database.sequelize
                    .transaction(async (t) => {
                        // Update the database
                        await context.instance.save({ transaction: t });
                        // Move the replacement file to new path
                        await fs.move(req.file.path, res.locals.newPath, { overwrite: true });
                        // Delete old file at old path
                        if (res.locals.oldPath !== res.locals.newPath) {
                            fs.remove(res.locals.oldPath)
                                .catch(async (error) => {
                                    debug(error);
                                    debug('Unable to delete old file');
                                    // Cannot delete file, attempt to log
                                    await ensureDir(file_storage_path);
                                    await fs.appendFile(
                                        file_storage_path + 'undeleted_files.txt',
                                        res.locals.oldPath + '\n'
                                    );
                                    // Logging success
                                    debug('Undeleted file logged at: "' + file_storage_path + 'undeleted_files.txt"');
                                })
                                .catch((error) => {
                                    debug('Unable to log undeleted file');
                                    debug(error);
                                });
                        } // End of delete old file at old path
                    }); // End of transaction
            } // End of if else
        })
        .then(() => {
            // Skip finale's default write function
            return context.skip;
        })
        .catch((error) => {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                send400(res, new Error('user does not exist'));
            } else {
                send500(res, error);
            }
            return context.stop;
        });
});

/**
 * Delete database record and physical file
 */
resource.delete.write.before((req, res, context) => {
    return database.sequelize
        .transaction(async (t) => {
            // Delete database record
            await context.instance.destroy({ transaction: t });
            // Obtain file path
            const filePath = await getFilePath(context.instance.directoryid, context.instance.filename);
            // Delete physical file
            if (filePath) {
                await fs.remove(filePath);
            }
        })
        .then(() => {
            // Skip finale's default write function
            return context.skip;
        })
        .catch((error) => {
            send500(res, error);
            return context.stop;
        });
});

router.use((req, res, next) => {
    res.status(405).send({ message: 'Method not accepted' });
});

module.exports = router;
