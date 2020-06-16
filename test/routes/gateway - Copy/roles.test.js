/**
 * Tests api roles
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('API Roles', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        // Tests CRUD operations
        describe('CRUD Endpoints', () => {
            // Create role
            describe('POST /api/roles', function () {
                it('should create a role', function (done) {
                    server
                        .post('/api/roles')
                        .type('form') // Simulate form submission
                        .send({
                            rolename: 'arbitrarylongrolename',
                        })
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.should.be.json;
                            done();
                        });
                });
            });

            // Read all roles
            describe('GET /api/roles', function () {
                it('should get all roles', function (done) {
                    server.get('/api/roles').end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
                });
            });

            // Read role
            describe('GET /api/roles/:rolename', function () {
                it('should get a role', function (done) {
                    server
                        .get('/api/roles/arbitrarylongrolename')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.json;
                            done();
                        });
                });
            });

            // Delete role
            describe('DELETE /api/roles/:rolename', function () {
                it('should delete a role', function (done) {
                    server
                        .delete('/api/roles/arbitrarylongrolename')
                        .end((err, res) => {
                            res.should.have.status(200);
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
