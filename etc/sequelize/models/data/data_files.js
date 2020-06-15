const { DataTypes } = require('sequelize');

/**
 * Type definition for data_files
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('data_files', {
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
        data_table_name: { type: DataTypes.STRING },
        select_own_data: { type: DataTypes.BOOLEAN },
        insert_own_data: { type: DataTypes.BOOLEAN },
        update_own_data: { type: DataTypes.BOOLEAN },
        delete_own_data: { type: DataTypes.BOOLEAN },
    });
}

module.exports.define = define;
