const AWS = require('aws-sdk');
const express = require('express');
require('dotenv').config({path:__dirname+'/.env'});

const app = express();
const sns = new AWS.SNS();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
AWS.config.update({
	region: process.env.Region,
	accessKeyId: process.env.AccessKeyId,
	secretAccessKey: process.env.SecretAccessKey,
});

app.get('/', (req, res) => {
	res.send("Welcome to example of Lambda-SNS-API_Gateway")
});

app.get('/test/:demo?', (req, res) => {
	res.send(`This is testing- ${req.params.demo} ${process.env.SNSTopicArn}`);
});

app.get('/send-email/:subject?/:body?/:email?', async(req, res) => {
	console.log('req.params.body', req.params.body, req.params.subject, req.params.body, req.params.email);
	const snsParams = {
		Message: req.params.body || "This is default mail to test lambda-sns-api demo",
		Subject: req.params.subject || "This is subject",
		TopicArn: process.env.SNSTopicArn
	};
	try {
		await sns.publish(snsParams).promise();
		res.send('Email sent to SNS topic.');
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Error sending email to SNS topic.');
	}
});
  
app.get('/send-sms/:msg?/:number?', (req, res) => {
	const params = {
		Message: req.params.msg || 'Hello, this is an SMS notification!',
		PhoneNumber: req.params.number || process.env.MobileNumber,
		// TopicArn: process.env.SNSTopicArn,
		MessageAttributes: {
			'AWS.SNS.SMS.SMSType': { DataType: 'String', StringValue: 'Transactional' }
		}
	};
	try{
		sns.publish(params, (err, data) => {
			if (err) {
				console.error(err);
				res.status(500).json({ error: 'Error sending SMS.' });
			} else {
				console.log('SMS sent successfully:', data);
				res.json({ message: 'SMS sent successfully.' });
			}
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Error sending sms to SNS topic.');
	}
});

app.get('/send-promotional-sms/:msg?/:number?', (req, res) => {
	const sns = new AWS.SNS();
  
	const params = {
		Message: req.params.msg || 'Hello, this is a promotional SMS notification!',
		PhoneNumber: req.params.number || process.env.MobileNumber,
		MessageAttributes: {
			'AWS.SNS.SMS.SMSType': { DataType: 'String', StringValue: 'Promotional' }
		}
	};
  
	sns.publish(params, (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: 'Error sending promotional SMS.' });
		} else {
			console.log('Promotional SMS sent successfully:', data);
			res.json({ message: 'Promotional SMS sent successfully.' });
		}
	});
});
  
// app.listen(8088);

module.exports = app; 