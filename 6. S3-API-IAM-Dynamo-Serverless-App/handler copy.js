const AWS = require("aws-sdk");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config({path:__dirname+'/.env'});
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");
const upload = multer();
const s3 = new AWS.S3();
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
const s3Client = new S3Client({ region: process.env.AWS_REGION });


module.exports.getUser = async (event) => {
    console.log('getuser : - ', " DYNAMODB_TABLE : - ",process.env.DYNAMODB_TABLE );
    try {
        const { id } = event.pathParameters;
        console.log('getuser', "id:-",id);
        // get user data from DynamoDB
        const result = await dynamoDB
        .get({
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id },
        })
        .promise();
        console.log('result', result);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User detail fetched successfully", data: result.Item })
        };
    } catch (error) {
        console.log('getUser error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
}

module.exports.getUserList = async (event) => {
    console.log('getuserlist : - ', " DYNAMODB_TABLE : - ",process.env.DYNAMODB_TABLE );
    try {
        
		const params = {
			TableName: process.env.DYNAMODB_TABLE, 
            // Key: { id },
		};
		const result = await dynamoDB.scan(params).promise();
        console.log('result all user:- ', result);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "All user details fetched successfully", data: result.Items })
        };
    } catch (error) {
        console.log('getUserList error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
}

module.exports.createUser = async (event) => {
    try {
        const { name, email } = JSON.parse(event.body);
        const file = event.body.file; 
        if (!file || !file.content || !file.filename) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid file upload" }),
            };
        }

        console.log(`NAME - ${name},  EMAIL - ${email}, FILE - ${file}`);
        // Save user data to DynamoDB
        const userItem = {
            id: Date.now().toString(),
            name,
            email,
        };
        await dynamoDB
        .put({
            TableName: process.env.DYNAMODB_TABLE,
            Item: userItem,
        })
        .promise();

        // Upload file to S3
        // const file = event.files['file'][0];
        // const fileKey = `user-files/${userItem.id}/${file.originalname}`;
        // await s3
        // .putObject({
        //     Bucket: process.env.S3_BUCKET_NAME,
        //     Key: fileKey,
        //     Body: file.buffer,
        // })
        // .promise();

        // Upload file logic using the AWS SDK v3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.filename,
            Body: file.content,
        };    
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        const message = JSON.stringify(userItem);
        // Publish user creation event to SNS topic
        await sns
        .publish({
            TopicArn:  process.env.USER_TOPIC,
            Message: message,
        })
        .promise();

        // Send user creation message to SQS queue for further processing
        await sqs
        .sendMessage({
            QueueUrl: process.env.USER_QUEUE,
            MessageBody: message,
        })
        .promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

module.exports.updateUser = async (event) => {
    console.log('updateUser : - ',event, " DYNAMODB_TABLE : - ",process.env.DYNAMODB_TABLE );
    try {
        const { id } = event.pathParameters;
        const updatedUser = JSON.parse(event.body);
        console.log('updatedUser', "id:-",id, "updatedUser:-",updatedUser);
        // Update user data in DynamoDB
        await dynamoDB
        .update({
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id },
            UpdateExpression: "SET #name = :name, #email = :email",
            ExpressionAttributeNames: {
                "#name": "name",
                "#email": "email",
            },
            ExpressionAttributeValues: {
                ":name": updatedUser.name,
                ":email": updatedUser.email,
            },
        })
        .promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User updated successfully" }),
        };
    } catch (error) {
        console.log('updateUser error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

module.exports.deleteUser = async (event) => {
    console.log('deleteUser : - ', " DYNAMODB_TABLE : - ",process.env.DYNAMODB_TABLE );
    try {
        const { id } = event.pathParameters;
        console.log('deleteUser', "id:-",id);
        // Delete user data from DynamoDB
        await dynamoDB
        .delete({
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id },
        })
        .promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User deleted successfully" }),
        };
    } catch (error) {
        console.log('deleteUser error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
