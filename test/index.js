const postgres = require('../bin/pgctl');
const chai = require('chai');
const chaiHttp = require('chai-http');

// Config environment for test
require('dotenv').config();
process.env.NODE_ENV = 'test';
const timeout = 5000;

// Set up chai
chai.use(chaiHttp);
chai.should();

// Start application server
const server = chai.request(require('../app')).keepOpen();

// Chain the tests
var test2 = chain(require('./routes/gateway/users.test').test, done);
var test1 = chain(require('./app.test').test, test2);

// Run the tests
test1();


function done() {
    console.log('ended');
    postgres.stop();
    server.close();
    
}

function chain(func, next) {
    return function() {
        func(server, timeout, next);
    };
}
