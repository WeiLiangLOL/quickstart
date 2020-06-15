const { DataTypes } = require('sequelize');

/**
 * Type definition for rolefunctions
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('rolefunctions', {
        rolefunctionid: { type: DataTypes.INTEGER, primaryKey: true },
        rolename: { type: DataTypes.STRING, unique: 'rolefunctions_ukey' },
        functionname: { type: DataTypes.STRING, unique: 'rolefunctions_ukey' }
    });
}

module.exports.define = define;
