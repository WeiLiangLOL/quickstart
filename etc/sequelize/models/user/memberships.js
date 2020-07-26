const { DataTypes } = require('sequelize');

/**
 * Type definition for memberships
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('memberships', {
        membershipid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: { type: DataTypes.STRING, unique: 'memberships_ukey' },
        groupname: { type: DataTypes.STRING, unique: 'memberships_ukey' }, // ltree type
        rolename: { type: DataTypes.STRING, unique: 'memberships_ukey' },
        propagate: { type: DataTypes.BOOLEAN, defaultValue: false },
    });
}

module.exports.define = define;
