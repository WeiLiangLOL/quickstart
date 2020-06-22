const { DataTypes } = require('sequelize');

/**
 * Type definition for functions
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('functions', {
        functionname: { type: DataTypes.STRING, primaryKey: true },
    });
}

module.exports.define = define;
