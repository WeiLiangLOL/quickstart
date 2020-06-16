const { DataTypes } = require('sequelize');

/**
 * Type definition for group_file_acl
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('group_file_acl', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        fileid: { type: DataTypes.BIGINT, unique: 'gfacl_ukey' },
        groupid: { type: DataTypes.INTEGER, unique: 'gfacl_ukey' },
        roleid: { type: DataTypes.INTEGER, unique: 'gfacl_ukey' },
    });
}

module.exports.define = define;
