const { DataTypes } = require('sequelize');

/**
 * Type definition for user_datafile_acls
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('user_datafile_acls', {
        permissionid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        read_bit: { type: DataTypes.BOOLEAN },
        write_bit: { type: DataTypes.BOOLEAN },
        fileid: { type: DataTypes.BIGINT, unique: 'ufacl_ukey' },
        username: { type: DataTypes.STRING, unique: 'ufacl_ukey' },
    });
}

module.exports.define = define;
