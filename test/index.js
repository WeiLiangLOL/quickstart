// Config environment for test
require("dotenv").config();
process.env.NODE_ENV = "test";

require("./app.test");
