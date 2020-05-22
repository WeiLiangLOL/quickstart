const bcrypt = require('bcryptjs');
const debug = require('debug')('quickstart:database-seed');

/**
 * Seeding method for development work,
 * ensures we have a dataset to work with
 * 
 * @param {Sequelize.database} database 
 */
function populate(database) {
    // Hash and salt 10 rounds
    bcrypt.hash('password', 10, function (err, hash) {

        database.users.findOrCreate({
            where: { username: 'weiliang' },
            defaults: {
                username: 'weiliang',
                passwordHash: hash,
                firstName: 'WeiLiang',
                lastName: 'Kuah',
                phoneNumber: '85155931',
                email: 'kuahweiliang@hotmail.com',
                dateOfBirth: '1997-07-16 00:00:00',
                gender: 'male',
                nationality: 'Singapore'
            }
        }).then(user => {
            debug(`User 'weiliang' populated`);
        });
        
    });
}

module.exports = {
    populate: populate
}