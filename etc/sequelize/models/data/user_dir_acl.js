const { DataTypes } = require('sequelize');

/**
 * Type definition for user_dir_acl
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('user_dir_acl', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        directoryid: { type: DataTypes.INTEGER, unique: 'udacl_ukey' },
        propagate: { type: DataTypes.BOOLEAN },
        userid: { type: DataTypes.INTEGER, unique: 'udacl_ukey' },
    });
}

module.exports.define = define;
