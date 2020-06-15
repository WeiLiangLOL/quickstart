/**
 * Tests api roles
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('Role CRUD Endpoints', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        const rolename = 'arbitrarylongrolename';

        // Read all roles
        it('Query all roles\tGET /api/roles', function (done) {
            list()(server, done);
        });

        // Create role
        it('Create role\tPOST /api/roles', function (done) {
            create(rolename)(server, done);
        });

        // Read role
        it('Query role\tGET /api/roles/:id', function (done) {
            read(rolename)(server, done);
        });

        // Delete role
        it('Delete role\tDELETE /api/roles/:id', function (done) {
            remove(rolename)(server, done);
        });

        after(next);
    });
}

function create(rolename) {
    return function(server, done) {
            server
                .post('/api/roles')
                .type('form') // Simulate form submission
                .send({
                    rolename: rolename
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.be.json;
                    done();
                });
    }
}

function read(rolename) {
    return function(server, done) {
            server
                .get('/api/roles/' + rolename)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    done();
                });
    }
}

function list() {
    return read('');
}

function remove(rolename) {
    return function(server, done) {
        server
            .delete('/api/roles/arbitrarylongrolename')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    }
}

module.exports = {
    test: test,
    create: create,
    read: read,
    list: list,
    remove: remove
};
