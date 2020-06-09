const { Sequelize, DataTypes } = require('sequelize');
const debug = require('debug')('quickstart:database');
const transactions = require('debug')('quickstart:database-messages');

const productionDefaults = {
    underscored: true, 
    timestamps: true 
};
    
const developmentDefaults = { 
    schema: 'quickstart', 
    underscored: true, 
    timestamps: false 
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
    
    var isProduction = process.env.NODE_ENV === 'production';
    var defaults = (isProduction) ? productionDefaults : developmentDefaults;
    
    // Establish connection
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: (...msg) => transactions(msg),
        //logging: (...msg) => {}, // Warning: Blackhole
        define: defaults
    });
    debug('Database connection established');
    
    // Populate references
    database.sequelize = sequelize; // Warning: potentially bad code
    database.users = require('./models/users').define(sequelize);
    database.groups = require('./models/groups').define(sequelize);
}

module.exports = {
    init: init,
    database: database
};
