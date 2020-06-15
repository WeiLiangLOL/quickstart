/**
 * Tests api functions
 *
 * @param {Chai.Agent} server testing interface
 * @param {number} timeout time before expiring
 * @param {Function} next callback reference when done
 */
function test(server, timeout, next) {
    // Tests CRUD operations
    describe('Function CRUD Endpoints', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        // Read all functions
        it('Query all functions\tGET /api/functions', function (done) {
            list()(server, done);
        });

        // Read function () {
        it('Query function\tGET /api/functions/:id', function (done) {
            read('Dummy')(server, done);
        });

        // Tests bad operations
        describe('Fail Checks', () => {
            // Create function
            it('Create function\tPOST /api/functions', function (done) {
                server
                    .post('/api/functions')
                    .type('form') // Simulate form submission
                    .send({
                        functionname: 'arbitrarylongfunctionname'
                    })
                    .end((err, res) => {
                        // Postgres user permission denied
                        res.should.have.status(500);
                        res.should.be.json;
                        done();
                    });
            });
            // Delete function
            it('Delete function\tDELETE /api/functions/:id', function (done) {
                server
                    .delete('/api/functions/Dummy')
                    .end((err, res) => {
                        // Postgres user permission denied
                        res.should.have.status(500);
                        res.should.be.json;
                        done();
                    });
            });
        });

        after(next);
    });
}

function read(functionname) {
    return function(server, done) {
        server
            .get('/api/functions/' + functionname)
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

module.exports = {
    test: test,
    read: read,
    list: list
};
