const { DataTypes } = require('sequelize');

/**
 * Type definition for directories
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('directories', {
        directoryid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        superdirectory: { type: DataTypes.INTEGER, unique: 'directory_ukey' },
        groupid: { type: DataTypes.INTEGER },
        directoryname: { type: DataTypes.STRING, unique: 'directory_ukey'}
    });
}

module.exports.define = define;
