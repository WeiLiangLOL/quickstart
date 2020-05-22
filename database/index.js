const { Sequelize } = require('sequelize');
const debug = require('debug')('quickstart:database');
const service = require('./startup');

/**
 * Initializes database connection
 * 
 * @param {Express.Application} app the express application 
 */
function init(app) {
    service.start(() => {
        if (process.env.NODE_ENV !== 'development') {
            // TODO: Haven't set this up
        } else {
            app.sequelize = new Sequelize('postgres://postgre:22Fast+++@example.com:5432/dbname');
        }

        debug('Database connection established');
    });
}

module.exports = {
    init: init
}