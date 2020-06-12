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
    database.users = defineModel('./models/users');
    database.groups = defineModel('./models/groups');
    database.memberships = defineModel('./models/memberships');
    database.privileges = defineModel('./models/privileges');
    database.roles = defineModel('./models/roles');
}

function defineModel(modelPath) {
    return require(modelPath).define(database.sequelize);
}

function associate() {
    database.users.hasOne(database.privileges, { foreignKey: 'userid' });
    database.privileges.belongsTo(database.users, { foreignKey: 'userid' });

    database.users.hasMany(database.memberships, { foreignKey: 'userid' });
    database.memberships.belongsTo(database.users, { foreignKey: 'userid' });

    database.groups.hasMany(database.memberships, { foreignKey: 'groupid' });
    database.memberships.belongsTo(database.groups, {
        foreignKey: 'groupid',
    });

    database.groups.belongsTo(database.groups, { foreignKey: 'supergroup' });

    database.roles.hasMany(database.memberships, { foreignKey: 'roleid' });
    database.memberships.belongsTo(database.roles, { foreignKey: 'roleid' });
}

module.exports = {
    init: init,
    database: database,
};
