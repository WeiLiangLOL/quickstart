const { DataTypes } = require('sequelize');

/**
 * Type definition for groups
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('groups', {
        groupid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        groupname: { type: DataTypes.STRING, unique: true },
        supergroup: { type: DataTypes.STRING },
    });
}

module.exports.define = define;
