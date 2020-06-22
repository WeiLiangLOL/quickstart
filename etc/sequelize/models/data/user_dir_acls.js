const { DataTypes } = require('sequelize');

/**
 * Type definition for user_dir_acls
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('user_dir_acls', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        directoryid: { type: DataTypes.INTEGER, unique: 'udacl_ukey' },
        propagate: { type: DataTypes.BOOLEAN },
        username: { type: DataTypes.STRING, unique: 'udacl_ukey' },
    });
}

module.exports.define = define;
