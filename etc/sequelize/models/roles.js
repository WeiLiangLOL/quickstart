const { DataTypes } = require('sequelize');

/**
 * Type definition for roles
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('roles', {
        roleid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rolename: { type: DataTypes.STRING, unique: true },
    });
}

module.exports.define = define;
