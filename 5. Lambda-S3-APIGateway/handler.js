'use strict';
const app = require('./server.js');
const serverlessHttp = require('serverless-http');

module.exports.handlerFunction = serverlessHttp(app);
