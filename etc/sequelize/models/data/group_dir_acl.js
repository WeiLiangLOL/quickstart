const { DataTypes } = require('sequelize');

/**
 * Type definition for group_dir_acl
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('group_dir_acl', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        directoryid: { type: DataTypes.INTEGER, unique: 'gdacl_ukey' },
        propagate: { type: DataTypes.BOOLEAN },
        groupid: { type: DataTypes.INTEGER, unique: 'gdacl_ukey' },
        roleid: { type: DataTypes.INTEGER, unique: 'gdacl_ukey' },
    });
}

module.exports.define = define;
