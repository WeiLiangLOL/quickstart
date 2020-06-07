const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

// Set up chai
chai.use(chaiHttp);
chai.should();

// Testing
function test(timeout) {
    describe('Page Navigation', () => {
        describe('GET /', () => {
            it('should get main page', (done) => {
                chai.request(app)
                    .get('/')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
        });
    }).timeout(timeout);
}

module.exports = {
    test: test
};