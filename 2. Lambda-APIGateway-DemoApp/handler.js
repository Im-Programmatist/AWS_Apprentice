'use strict';
const app = require('./index.js');
const serverlessHttp = require('serverless-http');

module.exports.sampleHandlerFunction = serverlessHttp(app);

// In case of no express app created we can use below sample code to run serverless with handler
// module.exports.firstFunc = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
