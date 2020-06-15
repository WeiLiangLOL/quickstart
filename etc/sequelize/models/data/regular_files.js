const { DataTypes } = require('sequelize');

/**
 * Type definition for regular_files
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('regular_files', {
        fileid: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        filename: { type: DataTypes.STRING, unique: 'data_files_ukey' },
        directoryid: { type: DataTypes.INTEGER, unique: 'data_files_ukey' },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE },
        islocked: { type: DataTypes.BOOLEAN },
        owner: { type: DataTypes.INTEGER },
        filepath: { type: DataTypes.STRING },
        filesize: { type: DataTypes.BIGINT },
    });
}

module.exports.define = define;
