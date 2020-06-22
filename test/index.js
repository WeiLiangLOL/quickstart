const postgres = require('../bin/pgctl');
const chai = require('chai');
const chaiHttp = require('chai-http');

// Start postgres
require('../bin/pgctl').start();

// Config environment for test
require('dotenv').config();
process.env.NODE_ENV = 'test';
const timeout = process.env.TEST_TIMEOUT || 5000;

// Set up chai
chai.use(chaiHttp);
chai.should();

// Start application server
const server = chai.request(require('../app')).keepOpen();

// Define the test sequence
const chain = [
    use('./sequelize/index.test'),
    use('./app.test'),
    use('./routes/gateway/users.test'),
    use('./routes/gateway/groups.test'),
    use('./routes/gateway/roles.test'),
    use('./routes/gateway/functions.test'),
    use('./routes/gateway/privileges.test'), // Not Done
    use('./routes/gateway/users.test'), // Deletable
    done,
];

function use(testPath) {
    let testFunc = require(testPath).test;
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

// Chain the test
const start = chain.reduceRight((next, current) => {
    return current(next);
});

start();
