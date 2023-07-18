'use strict';
const app = require('./index.js');
const serverlessHttp = require('serverless-http');

module.exports.lmbdSNSHandlerFunction = serverlessHttp(app);

/* Demo of SNS notification through lambda */
// const AWS = require('aws-sdk');
// const sns = new AWS.SNS();

// exports.lmbdSNSHandlerFunction = async (event, context) => {
// 	const snsParams = {
// 		Message: 'Hello from the Lambda function!',
// 		TopicArn: 'arn:aws:sns:ap-south-1:886201725021:DemoSNS'
// 	};

// 	try {
// 		await sns.publish(snsParams).promise();
// 		return {
// 			statusCode: 200,
// 			body: 'Message sent to SNS topic.'
// 		};
// 	} catch (error) {
// 		console.error('Error:', error);
// 		return {
// 			statusCode: 500,
// 			body: 'Error sending message to SNS topic.'
// 		};
// 	}
// };
