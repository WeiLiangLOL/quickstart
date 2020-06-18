/**
 * Tests api privileges
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('Privilege CRUD Endpoints (Not Done)', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        const user = require('./users.test.js');
        const username = 'arbitrarylongusername';

        before('Create user ' + username, function (done) {
            user.create(username)(server, done);
        });

        // Not Done
        // Read all groups
        it('Query all groups\tGET /api/groups (Not Done)', function (done) {
            done();
        });

        // Not Done
        // Create group
        it('Create group\tPOST /api/groups (Not Done)', function (done) {
            done();
        });

        // Not Done
        // Read group
        it('Query group\tGET /api/group/:id (Not Done)', function (done) {
            done();
        });

        // Not Done
        // Delete group
        it('Delete group\tDELETE /api/groups/:id (Not Done)', function (done) {
            done();
        });

        after('Remove user' + username, function (done) {
            user.remove(username)(server, done);
        });

        after(next);
    });
}


module.exports = {
    test: test
};
