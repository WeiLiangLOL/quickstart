const { DataTypes } = require('sequelize');

/**
 * Type definition for group_dir_acls
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('group_dir_acls', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        directoryid: { type: DataTypes.INTEGER, unique: 'gdacl_ukey' },
        propagate: { type: DataTypes.BOOLEAN },
        groupname: { type: DataTypes.STRING, unique: 'gdacl_ukey' },
        rolename: { type: DataTypes.STRING, unique: 'gdacl_ukey' },
    });
}

module.exports.define = define;
