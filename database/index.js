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
    if (process.env.NODE_ENV === 'production') {
        // TODO: Not implemented
    } else {
        service.start(() => {
            debug('Database connection established');
            sequelize = new Sequelize('postgres://postgre:22Fast+++@example.com:5432/dbname');
        });
    }
}

module.exports = {
    init: init,
    sequelize: sequelize
}