/**
 * Tests api functions
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('API Functions', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        // Tests CRUD operations
        describe('CRUD Endpoints', () => {
            // Read all functions
            describe('GET /api/functions', function () {
                it('should get all functions', function (done) {
                    server.get('/api/functions').end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
                });
            });

            // Read function
            describe('GET /api/functions/:functionname', function () {
                it('should get a function', function (done) {
                    server.get('/api/functions/Dummy').end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
                });
            });
        });

        // Tests bad operations
        describe('Fail Checks', () => {
            // Create function
            describe('POST /api/functions', function () {
                it('should not create a function', function (done) {
                    server
                        .post('/api/functions')
                        .type('form') // Simulate form submission
                        .send({
                            functionname: 'arbitrarylongfunctionname',
                        })
                        .end((err, res) => {
                            // Postgres user permission denied
                            res.should.have.status(500);
                            res.should.be.json;
                            done();
                        });
                });
            });
            // Delete function
            describe('DELETE /api/functions/:functionname', function () {
                it('should not delete a function', function (done) {
                    server.delete('/api/functions/Dummy').end((err, res) => {
                        // Postgres user permission denied
                        res.should.have.status(500);
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
