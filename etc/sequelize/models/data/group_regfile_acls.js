const { DataTypes } = require('sequelize');

/**
 * Type definition for group_regfile_acls
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('group_regfile_acls', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        fileid: { type: DataTypes.BIGINT, unique: 'gfacl_ukey' },
        groupname: { type: DataTypes.STRING, unique: 'gfacl_ukey' },
        rolename: { type: DataTypes.STRING, unique: 'gfacl_ukey' },
    });
}

module.exports.define = define;
