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
console.log('Starting server');
const server = chai.request(require('../app')).keepOpen();

// Define the test sequence
var chain = [
    use('./app.test'),
    use('./routes/gateway/users.test'),
    use('./app.test'),
    use('./routes/gateway/users.test'),
    use('./app.test'),
    use('./routes/gateway/users.test'),
    use('./app.test'),
    use('./routes/gateway/users.test'),
    use('./app.test'),
    done,
];

// Chain the test
var start = chain.reduceRight((next, current) => {
    return current(next);
});

// Start the test
start();

function use(testPath) {
    var testFunc = require(testPath).test;
    return function (next) {
        return function () {
            testFunc(server, timeout, next);
        };
    };
}

function done() {
    postgres.stop();
    server.close();
}
