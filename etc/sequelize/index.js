const { Sequelize } = require('sequelize');
const debug = require('debug')('quickstart:database');

// Toggle verbosity
const transactions =
    (process.env.DATABASE_VERBOSITY || '').trim() === 'true'
        ? require('debug')('quickstart:database-messages')
        : (msg) => {};

const productionDefaults = {
    underscored: true,
    timestamps: true,
};

const developmentDefaults = {
    schema: 'quickstart',
    underscored: true,
    timestamps: false,
};

/**
 * Stores all table connectors
 *
 * @type {Sequelize.database} database reference
 */
const database = {};

/**
 * Initializes database connection
 */
function init() {
    var isProduction = (process.env.NODE_ENV || '').trim() === 'production';
    var defaults = isProduction ? productionDefaults : developmentDefaults;

    // Establish connection
    database.sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: (...msg) => transactions(msg),
        define: defaults,
    });
    debug(`Listening on port ${database.sequelize.config.port}`);

    reference();
    associate();
}

function reference() {
    database.users = defineModel('./models/user/users');
    database.groups = defineModel('./models/user/groups');
    database.roles = defineModel('./models/user/roles');
    database.functions = defineModel('./models/user/functions');
    database.privileges = defineModel('./models/user/privileges');
    database.memberships = defineModel('./models/user/memberships');
    database.rolefunctions = defineModel('./models/user/rolefunctions');

    database.directories = defineModel('./models/data/directories');
    database.data_files = defineModel('./models/data/data_files');
    database.regular_files = defineModel('./models/data/regular_files');
    database.user_file_acl = defineModel('./models/data/user_file_acl');
    database.group_file_acl = defineModel('./models/data/group_file_acl');
    database.user_dir_acl = defineModel('./models/data/user_dir_acl');
    database.group_dir_acl = defineModel('./models/data/group_dir_acl');
}

function defineModel(modelPath) {
    return require(modelPath).define(database.sequelize);
}

function associate() {

    var db = database;

    db.users.hasOne(db.privileges, { foreignKey: 'username' });
    db.privileges.belongsTo(db.users, { foreignKey: 'username' });

    db.users.hasMany(db.memberships, { foreignKey: 'username' });
    db.memberships.belongsTo(db.users, { foreignKey: 'username' });

    db.groups.hasMany(db.memberships, { foreignKey: 'groupname' });
    db.memberships.belongsTo(db.groups, { foreignKey: 'groupname' });

    db.roles.hasMany(db.memberships, { foreignKey: 'rolename' });
    db.memberships.belongsTo(db.roles, { foreignKey: 'rolename' });

    db.roles.hasMany(db.rolefunctions, { foreignKey: 'rolename' });
    db.rolefunctions.belongsTo(db.roles, { foreignKey: 'rolename' });

    db.functions.hasMany(db.rolefunctions, { foreignKey: 'functionname' });
    db.rolefunctions.belongsTo(db.functions, { foreignKey: 'functionname' });

    db.directories.hasMany(db.data_files, { foreignKey: 'directoryid' });
    db.directories.hasMany(db.regular_files, { foreignKey: 'directoryid' });
    db.directories.hasMany(db.user_dir_acl, { foreignKey: 'directoryid' });
    db.directories.hasMany(db.group_dir_acl, { foreignKey: 'directoryid' });

    db.data_files.belongsTo(db.directories, { foreignKey: 'directoryid' });
    db.data_files.belongsTo(db.users, { foreignKey: 'owner' });
    db.data_files.hasMany(db.user_file_acl, { foreignKey: 'fileid' });
    db.data_files.hasMany(db.group_file_acl, { foreignKey: 'fileid' });

    db.regular_files.belongsTo(db.directories, { foreignKey: 'directoryid' });
    db.regular_files.belongsTo(db.users, { foreignKey: 'owner' });
    db.regular_files.hasMany(db.user_file_acl, { foreignKey: 'fileid' });
    db.regular_files.hasMany(db.group_file_acl, { foreignKey: 'fileid' });

}

module.exports = {
    init: init,
    database: database,
};
