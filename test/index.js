const service = require('../database/service');

// Config environment for test
require('dotenv').config();
process.env.NODE_ENV = 'test';

const timeout = 10000;

// Tests
require('./app.test').test(timeout);

// Cleanup
setTimeout(() => {
    service.end();
    // Force exit
    process.exit(0);
}, timeout);
