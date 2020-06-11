const { DataTypes } = require('sequelize');

/**
 * Type definition for roles
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('roles', {
        rolename: { type: DataTypes.STRING, primaryKey: true },
    });
}

module.exports.define = define;
