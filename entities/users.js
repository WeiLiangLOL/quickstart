const { DataTypes } = require('sequelize');

/**
 * Type definition for users
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define('users', {
        username: { type: DataTypes.STRING, primaryKey: true },
        password_hash: { type: DataTypes.STRING },
        firstname: { type: DataTypes.STRING },
        lastname: { type: DataTypes.STRING },
        cellphone: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        date_of_birth: { type: DataTypes.DATEONLY },
        gender: { type: DataTypes.STRING },
        nationality: { type: DataTypes.STRING },
        allow_login: { type: DataTypes.BOOLEAN },
    });
}

module.exports.define = define;
