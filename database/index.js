const { Sequelize } = require('sequelize');
const debug = require('debug')('quickstart:database');
const service = require('./startup');

let sequelize;

/**
 * Initializes database connection
 * 
 * @param {Express.Application} app the express application 
 */
function init(app) {
    service.start(() => {
        debug('Database connection established');

        if (process.env.NODE_ENV === 'production') {
            // TODO: Haven't set this up
        } else {
            sequelize = new Sequelize('postgres://postgre:22Fast+++@example.com:5432/dbname');
        }
    });
}

module.exports = {
    init: init,
    sequelize: sequelize
}