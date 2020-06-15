const { DataTypes } = require('sequelize');

/**
 * Type definition for user_file_acl
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('user_file_acl', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        fileid: { type: DataTypes.BIGINT, unique: 'ufacl_ukey' },
        userid: { type: DataTypes.INTEGER, unique: 'ufacl_ukey' },
    });
}

module.exports.define = define;
