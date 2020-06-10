

// Testing
function test(server, timeout, next) {
        
    describe('Page Navigation', function() {
        
        
        describe('GET /', function() {
            it('should get main page', function(done) {
                server.get('/')
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
