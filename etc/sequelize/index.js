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
    database.users = require('./models/users').define(database.sequelize);
    database.groups = require('./models/groups').define(database.sequelize);
    database.memberships = require('./models/memberships').define(
        database.sequelize
    );
    database.privileges = require('./models/privileges').define(
        database.sequelize
    );
    database.roles = require('./models/roles').define(database.sequelize);
}

function associate() {
    database.users.hasOne(database.privileges, { foreignKey: 'username' });
    database.privileges.belongsTo(database.users, { foreignKey: 'username' });

    database.users.hasMany(database.memberships, { foreignKey: 'username' });
    database.memberships.belongsTo(database.users, { foreignKey: 'username' });

    database.groups.hasMany(database.memberships, { foreignKey: 'groupname' });
    database.memberships.belongsTo(database.groups, {
        foreignKey: 'groupname',
    });

    // TODO: group self reference for supergroup

    database.roles.hasMany(database.memberships, { foreignKey: 'rolename' });
    database.memberships.belongsTo(database.roles, { foreignKey: 'rolename' });
}

module.exports = {
    init: init,
    database: database,
};
