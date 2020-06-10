// Testing
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('API Users Endpoint', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

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
                        done();
                    });
            });
        });

        // Read all user
        describe('GET /api/users', function () {
            it('should get all users', function (done) {
                server.get('/api/users').end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            });
        });

        // Read user
        describe('GET /api/users', function () {
            it('should get a user', function (done) {
                server
                    .get('/api/users/arbitrarylongusername')
                    .end((err, res) => {
                        res.should.have.status(200);
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
                        done();
                    });
            });
        });

        after(next);
    });
}

module.exports = {
    test: test,
};
