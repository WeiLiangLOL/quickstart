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
            autoIncrement: true,
        },
        filename: { type: DataTypes.STRING, unique: 'data_files_ukey' },
        directoryid: { type: DataTypes.INTEGER, unique: 'data_files_ukey' },
        islocked: { type: DataTypes.BOOLEAN },
        owner: { type: DataTypes.INTEGER },
        filesize: { type: DataTypes.BIGINT },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
}

module.exports.define = define;
