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
        it('Query all groups\tGET /api/groups', function (done) {
            list()(server, done);
        });

        // Not Done
        // Create group
        it('Create group\tPOST /api/groups', function (done) {
            create(username)(server, done);
        });

        // Not Done
        // Read group
        it('Query group\tGET /api/group/:id', function (done) {
            read(username)(server, done);
        });

        // Not Done
        // Delete group
        it('Delete group\tDELETE /api/groups/:id', function (done) {
            remove(username)(server, done);
        });

        // Tests bad operations
        describe('Fail Checks', () => {
            // Bad
            it('PUT /api/groups', (done) => {
                server.put('/api/groups').end((err, res) => {
                    res.should.have.status(405);
                    res.should.be.json;
                    done();
                });
            });
        });

        after('Remove user' + username, function (done) {
            user.remove(username)(server, done);
        });

        after(next);
    });
}

// Not Done
function create(groupname) {
    return function (server, done) {
        server
            .post('/api/groups')
            .type('form') // Simulate form submission
            .send({
                groupname: groupname,
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                done();
            });
    };
}

// Not Done
function read(groupname) {
    return function (server, done) {
        server.get('/api/groups/' + groupname).end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            done();
        });
    };
}

function list() {
    return read('');
}

// Not Done
function remove(groupname) {
    return function (server, done) {
        server.delete('/api/groups/' + groupname).end((err, res) => {
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
