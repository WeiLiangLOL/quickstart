/**
 * Tests api groups
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('Group CRUD Endpoints', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        const groupname = 'arbitrarylonggroupname';

        // Read all groups
        it('Query all groups\tGET /api/groups', function (done) {
            list()(server, done);
        });

        // Create group
        it('Create group\tPOST /api/groups', function (done) {
            create(groupname)(server, done);
        });

        // Read group
        it('Query group\tGET /api/group/:id', function (done) {
            read(groupname)(server, done);
        });

        // Delete group
        it('Delete group\tDELETE /api/groups/:id', function (done) {
            remove(groupname)(server, done);
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

        after(next);
    });
}

function create(groupname) {
    return function(server, done) {
        server
            .post('/api/groups')
            .type('form') // Simulate form submission
            .send({
                groupname: groupname
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                done();
            });
        }
}

function read(groupname) {
    return function(server, done) {
       server
           .get('/api/groups/' + groupname)
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

function remove(groupname) {
    return function(server, done) {
        server
            .delete('/api/groups/' + groupname)
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
    list: list,
    read: read,
    remove: remove
};
