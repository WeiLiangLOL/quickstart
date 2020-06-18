const session = require('express-session');
const passport = require('passport');

/**
 * Sets up Express session management
 *
 * @param {Express.Application} app
 */
function init(app) {
    // TODO: Additional reading required to secure session
    // https://github.com/expressjs/session
    app.use(
        session({
            secret: 'j8f4k9d3^space.;[',
            resave: false,
            saveUninitialized: false,
            //cookie: { secure: true } enable for compliance
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure session
    require('./strategy').config(passport);
}

module.exports = {
    init: init,
};
