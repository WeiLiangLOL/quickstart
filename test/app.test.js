// Testing
function test(server, timeout, next) {
    describe('Page Navigation', function () {
        // Set timeout for all test cases
        this.timeout(timeout);

        describe('GET /', function () {
            it('should get main page', function (done) {
                server.get('/').end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            });
        });

        describe('POST /auth/login', function () {
            it('should log in', function (done) {
                server
                    .post('/auth/login')
                    .type('form') // Simulate form submission
                    .send({
                        username: 'test',
                        password: '1234',
                    })
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
