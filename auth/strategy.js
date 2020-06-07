const bcrypt = require('bcrypt');
const database = require('../database').database;

/**
 * Configures strategy used
 *
 * @param {passport} passport
 */
function config(passport) {
    let LocalStrategy = require('passport-local').Strategy;
    passport.use(
        new LocalStrategy(function (username, password, done) {
            database.users.findByPk(username).then((user) => {
                if (user === null) {
                    return done(null, false, { message: 'Incorrect username' });
                }
                bcrypt.compare(password, user.password_hash).then( match => {
                    if (!match) {
                        return done(null, false, {
                            message: 'Incorrect password',
                        });
                    } else {
                        return done(null, user);
                    }
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });

    // Deserialize is ran each time a user GET/POST while logged in
    // Failing to deserialize is equivalent to logging out
    passport.deserializeUser(function (username, done) {
        database.users.findByPk(username).then((user) => {
            done(null, user);
        });
    });
}

module.exports = {
    config: config,
};
