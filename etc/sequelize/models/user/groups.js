const { DataTypes } = require('sequelize');

/**
 * Type definition for groups
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('groups', {
        groupname: { type: DataTypes.STRING, primaryKey: true }, // ltree type
    });
}

module.exports.define = define;
