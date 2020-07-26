const { DataTypes } = require('sequelize');

/**
 * Type definition for data_files
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('announcements', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        date: { type: DataTypes.DATE }
    });
}

module.exports.define = define;
