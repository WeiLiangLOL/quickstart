const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const service = require('../database/service');
const database = require('../database').database;

// Set up chai
chai.use(chaiHttp);
chai.should();

// Testing
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
}).timeout(10000);

// Cleanup
setTimeout(() => {
    service.end();
    // Force exit
    process.exit(0);
}, 10000);
