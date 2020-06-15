/**
 * Tests api groups
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('API Groups', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        // Tests CRUD operations
        describe('CRUD Endpoints', () => {
            // Create group
            describe('POST /api/groups', function () {
                it('should create a group', function (done) {
                    server
                        .post('/api/groups')
                        .type('form') // Simulate form submission
                        .send({
                            groupname: 'arbitrarylonggroupname'
                        })
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.should.be.json;
                            done();
                        });
                });
            });

            // Read all group
            describe('GET /api/groups', function () {
                it('should get all groups', function (done) {
                    server.get('/api/groups').end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
                });
            });

            // Read group
            describe('GET /api/group/:groupname', function () {
                it('should get a group', function (done) {
                    server
                        .get('/api/groups/arbitrarylonggroupname')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.json;
                            done();
                        });
                });
            });

            // Delete group
            describe('DELETE /api/groups/:groupname', function () {
                it('should delete a group', function (done) {
                    server
                        .delete('/api/groups/arbitrarylonggroupname')
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
            describe('PUT /api/groups', () => {
                it('should intentionally fail', (done) => {
                    server.put('/api/groups').end((err, res) => {
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
