const service = require('../database/service');

// Config environment for test
require('dotenv').config();
process.env.NODE_ENV = 'test';

const timeout = process.env.TEST_TIMEOUT || 10000;

// Tests
require('./app.test').test(timeout);
require('./routes/gateway/users.test').test(timeout);

// Cleanup
setTimeout(() => {
    service.end();
    // Force exit (ctrl + c)
    process.exit(0);
}, timeout + 1000); // Append additional 1s for cleanup
