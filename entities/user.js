const { DataTypes } = require("sequelize");

/**
 * Type definition for users
 *
 * @param {Sequelize} sequelize
 */
function define(sequelize) {
    return sequelize.define("users", {
        username: { type: DataTypes.STRING, primaryKey: true },
        passwordHash: { type: DataTypes.STRING },
        firstName: { type: DataTypes.STRING },
        lastName: { type: DataTypes.STRING },
        phoneNumber: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        dateOfBirth: { type: DataTypes.DATEONLY },
        gender: { type: DataTypes.STRING },
        nationality: { type: DataTypes.STRING },
    });
}

module.exports.define = define;
