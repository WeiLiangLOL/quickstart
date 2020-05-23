const { Sequelize, DataTypes } = require('sequelize');
const debug = require('debug')('quickstart:database');
const transactions = require('debug')('quickstart:database-messages');
const service = require('./startup');

/**
 * Stores all table connectors
 * 
 * @type {Sequelize.database} database reference
 */
const database = {};

/**
 * Initializes database connection
 * 
 * @param {Express.Application} app the express application 
 */
function init(app) {
    if (process.env.NODE_ENV === 'production') {
        // TODO: Not implemented
    } else {
        // Starts background service
        service.start(() => {
            // Establish connection
            const sequelize = new Sequelize({
                dialect: 'postgres',
                host: 'localhost',
                port: 5432,
                database: 'postgres',
                username: 'postgres',
                password: '22Fast+++',
                logging: (...msg) => transactions(msg),
                define: {
                    schema: 'quickstart',
                    underscored: true,
                    timestamps: false
                }
            });
            debug('Database connection established');

            // Populate references
            database.users = require('../entities/user').define(sequelize);
            
        });
    }
}

module.exports = {
    init: init,
    database: database
}