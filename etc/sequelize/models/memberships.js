const { DataTypes } = require('sequelize');

/**
 * Type definition for memberships
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('memberships', {
        username: { type: DataTypes.STRING, primaryKey: true },
        groupname: { type: DataTypes.STRING, primaryKey: true },
        rolename: { type: DataTypes.STRING, primaryKey: true },
        propagate: { type: DataTypes.BOOLEAN, defaultValue: false },
    });
}

module.exports.define = define;
