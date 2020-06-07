const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../app');

// Set up chai
chai.use(chaiHttp);
chai.should();

// Testing
function test(timeout) {
    // Tests CRUD operations
    describe('API Users Endpoint', () => {
        // Create user
        describe('POST /api/users', () => {
            it('should create a user', (done) => {
                setTimeout(() => {
                    chai.request(app)
                        .post('/api/users')
                        .type('form') // Simulate form submission
                        .send({
                            username: 'arbitrarylongusername',
                            password: 'password',
                            firstname: 'firstname',
                            lastname: 'lastname',
                            allow_login: 'true',
                        })
                        .end((err, res) => {
                            res.should.have.status(201);
                            done();
                        });
                }, 2000);
            }).timeout(timeout);
        });

        // Read all user
        describe('GET /api/users', () => {
            it('should get all users', (done) => {
                setTimeout(() => {
                    chai.request(app)
                        .get('/api/users')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }, 2000);
            }).timeout(timeout);
        });

        // Read user
        describe('GET /api/users', () => {
            it('should get a user', (done) => {
                setTimeout(() => {
                    chai.request(app)
                        .get('/api/users/arbitrarylongusername')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }, 2000);
            }).timeout(timeout);
        });

        // Delete user
        describe('DELETE /api/users/:id', () => {
            it('should delete a user', (done) => {
                setTimeout(() => {
                    chai.request(app)
                        .delete('/api/users/arbitrarylongusername')
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                }, 2000);
            }).timeout(timeout);
        });
    });
}

module.exports = {
    test: test,
};
