const { Sequelize, DataTypes } = require('sequelize');
const debug = require('debug')('quickstart:database');
const transactions = require('debug')('quickstart:database-messages');
const service = require('./service');

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
    // Starts background service
    service.start((define) => {
        // Establish connection
        const sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            logging: (...msg) => transactions(msg),
            define: define,
        });
        debug('Database connection established');

        // Populate references
        database.sequelize = sequelize; // Warning: potentially bad code
        database.users = require('../entities/users').define(sequelize);
        database.groups = require('../entities/groups').define(sequelize);
    });
}

module.exports = {
    init: init,
    database: database,
};
