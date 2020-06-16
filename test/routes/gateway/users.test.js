/**
 * Tests api users
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('User CRUD Endpoints', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        const username = 'arbitrarylongusername';

        // Read all users
        it('Query all users\tGET /api/users', function (done) {
            list()(server, done);
        });

        // Create user
        it('Create user\tPOST /api/users', function (done) {
            create(username)(server, done);
        });

        // Read user
        it('Query user\tGET /api/users/:id', function (done) {
            read(username)(server, done);
        });

        // Delete user
        it('Delete user\tDELETE /api/users/:id', function (done) {
            remove(username)(server, done);
        });

        // Tests bad operations
        describe('Fail Checks', () => {
            // Bad method
            it('DELETE /api/users', (done) => {
                server.delete('/api/users').end((err, res) => {
                    res.should.have.status(405);
                    res.should.be.json;
                    done();
                });
            });
        });

        after(next);
    });
}

function create(username) {
    return function (server, done) {
        server
            .post('/api/users')
            .type('form') // Simulate form submission
            .send({
                username: username,
                password: 'password',
                firstname: 'firstname',
                lastname: 'lastname',
                date_of_birth: '2001-01-01',
                gender: '1',
                allow_login: 'true',
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                done();
            });
    };
}

function read(username) {
    return function (server, done) {
        server.get('/api/users/' + username).end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
    };
}

function list() {
    return read('');
}

function remove(username) {
    return function (server, done) {
        server.delete('/api/users/' + username).end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
    };
}

module.exports = {
    test: test,
    create: create,
    list: list,
    read: read,
    remove: remove,
};
