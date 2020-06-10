const { DataTypes } = require('sequelize');

/**
 * Type definition for privileges
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('privileges', {
        username: { type: DataTypes.STRING, primaryKey: true },
        user_mgmt_priv: { type: DataTypes.BOOLEAN, defaultValue: false },
        data_mgmt_priv: { type: DataTypes.BOOLEAN, defaultValue: false },
    });
}

module.exports.define = define;
