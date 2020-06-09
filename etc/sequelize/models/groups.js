const { DataTypes } = require('sequelize');

/**
 * Type definition for groups
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('groups', {
        groupname: { type: DataTypes.STRING, primaryKey: true },
        supergroup: { type: DataTypes.STRING },
    });
}

module.exports.define = define;
