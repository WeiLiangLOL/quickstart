const { DataTypes } = require('sequelize');

/**
 * Type definition for memberships
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('memberships', {
        userid: { type: DataTypes.INTEGER, primaryKey: true },
        groupid: { type: DataTypes.INTEGER, primaryKey: true },
        roleid: { type: DataTypes.INTEGER, primaryKey: true },
        propagate: { type: DataTypes.BOOLEAN, defaultValue: false },
    });
}

module.exports.define = define;
