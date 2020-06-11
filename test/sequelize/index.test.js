const database = require('../../etc/sequelize').database;

// Testing
function test(server, timeout, next) {
    describe('Sequelize', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        describe('Connect', function () {
            it('should acquire connection', function (done) {
                database.should.have.property('sequelize');
                done();
            });
        });

        describe('Models', function () {
            it('should contain users', function (done) {
                database.should.have.property('users');
                done();
            });
            it('should contain groups', function (done) {
                database.should.have.property('groups');
                done();
            });
            it('should contain memberships', function (done) {
                database.should.have.property('memberships');
                done();
            });
            it('should contain privileges', function (done) {
                database.should.have.property('privileges');
                done();
            });
            it('should contain roles', function (done) {
                database.should.have.property('roles');
                done();
            });
        });

        after(next);
    });
}

module.exports = {
    test: test,
};
