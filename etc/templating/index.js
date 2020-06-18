const config = require('./config');

/**
 * Adds property to express locals
 *
 * @param {Object} locals
 */
function addProperties(locals) {
    for (let key of Object.keys(config)) {
        locals[key] = config[key];
    }
}

/**
 * Middlware for adding environment properties
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
function locals(req, res, next) {
    addProperties(res.locals);
    res.locals.req = req;
    next();
}

/**
 * Configures local properties
 *
 * @param {Express.Application} app
 */
function init(app) {
    addProperties(app.locals);
    app.use(locals);
}

module.exports = {
    init: init,
};
