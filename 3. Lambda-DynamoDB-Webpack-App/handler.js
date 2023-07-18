'use strict';
const app = require('./index.js');
const serverlessHttp = require('serverless-http');

// Export the app wrapped with serverless-http
module.exports.dynamoLambdaHandler = serverlessHttp(app);