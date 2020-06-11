/**
 * Tests api users
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('API Users', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        // Tests CRUD operations
        describe('CRUD Endpoints', () => {
            // Create user
            describe('POST /api/users', function () {
                it('should create a user', function (done) {
                    server
                        .post('/api/users')
                        .type('form') // Simulate form submission
                        .send({
                            username: 'arbitrarylongusername',
                            password: 'password',
                            firstname: 'firstname',
                            lastname: 'lastname',
                            allow_login: 'true',
                        })
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.should.be.json;
                            done();
                        });
                });
            });

            // Read all user
            describe('GET /api/users', function () {
                it('should get all users', function (done) {
                    server.get('/api/users').end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
                });
            });

            // Read user
            describe('GET /api/users/:id', function () {
                it('should get a user', function (done) {
                    server
                        .get('/api/users/arbitrarylongusername')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.json;
                            done();
                        });
                });
            });

            // Delete user
            describe('DELETE /api/users/:id', function () {
                it('should delete a user', function (done) {
                    server
                        .delete('/api/users/arbitrarylongusername')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.json;
                            done();
                        });
                });
            });
        });

        // Tests bad operations
        describe('Fail Checks', () => {
            // Bad method
            describe('DELETE /api/users', () => {
                it('should intentionally fail', (done) => {
                    server.delete('/api/users').end((err, res) => {
                        res.should.have.status(405);
                        res.should.be.json;
                        done();
                    });
                });
            });
        });

        after(next);
    });
}

module.exports = {
    test: test,
};
