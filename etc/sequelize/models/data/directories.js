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
        directoryname: { type: DataTypes.STRING, unique: 'directory_ukey'},
        groupname: { type: DataTypes.STRING, unique: 'directory_ukey' }
    });
}

module.exports.define = define;
