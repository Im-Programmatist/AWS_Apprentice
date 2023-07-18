const {
          DynamoDBDocument
      } = require("@aws-sdk/lib-dynamodb"),
      {
          DynamoDB
      } = require("@aws-sdk/client-dynamodb"),
      {
          SNSClient, 
          PublishCommand
      } = require("@aws-sdk/client-sns"),
      {
          SQSClient, 
          SendMessageCommand 
      } = require("@aws-sdk/client-sqs");
const {
    PutObjectCommand,
    S3,
    S3Client,
    GetObjectCommand 
} = require("@aws-sdk/client-s3");
const serverlessHttp = require("serverless-http");
require('dotenv').config({path:__dirname+'/.env'});
const dynamoDB = DynamoDBDocument.from(new DynamoDB());
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const snsClient = new SNSClient({ region: process.env.AWS_REGION  });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

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
        });
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
		const result = await dynamoDB.scan(params);
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

module.exports.uploadUserImage = serverlessHttp(app.post('*', upload.single('image'), async(req, res) => {
    try {
        const { id } = JSON.parse(JSON.stringify(req.body));
        const file = req.file;
        const folder = `${id}/`;
        if (!file || !file.buffer || !file.originalname) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid file upload" }),
            };
        }
    
        // Upload file logic using the AWS SDK v3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folder}${file.originalname}`,
            Body: file.buffer,
            ACL: 'public-read'
        };
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        // Send message to SNS topic
        const topicArn = process.env.USER_TOPIC_ARN // Replace with your SNS topic ARN
        const messageSNSParams = {
            TopicArn: topicArn,
            Message: `You have successfully uploaded image for id ${id}`,
        };
        const publishCommand = new PublishCommand(messageSNSParams);
        await snsClient.send(publishCommand);

        // // Send sqs message queue
        // const messageSQSParams = {
        //     QueueUrl:  process.env.SQS_QUEUE_ARN,
        //     MessageBody: "This is user upload image queue",
        // };
        // const sendMessageCommand = new SendMessageCommand(messageSQSParams);
        // await sqsClient.send(sendMessageCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "File uploaded successfully" }),
        };
       
    } catch (error) {
        console.log('error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }

}));
/*
module.exports.uploadUserImage = async (event) => {
    console.log('enter in upload image event');
    try {
        console.log('event in upload file', event.pathParameters);
        const { id } = event.pathParameters;
        const file = JSON.parse(event.body); // Assuming the field name is 'file' in the request
        console.log('file',file.filename, file.content, file);
        const folder = `${id}/`;
        if (!file || !file.content || !file.filename) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid file upload" }),
            };
        }
    
        // Upload file logic using the AWS SDK v3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folder}${id}.jpg`,
            Body: file.content,
        };
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        // Send message to SNS topic
        const topicArn = process.env.USER_TOPIC_ARN // Replace with your SNS topic ARN
        const messageSNSParams = {
            TopicArn: topicArn,
            Message: `You have successfully uploaded image for id ${id}`,
        };
        const publishCommand = new PublishCommand(messageSNSParams);
        await snsClient.send(publishCommand);

        // Send sqs message queue
        const queueUrl = process.env.SQS_QUEUE_ARN;
        const messageSQSParams = {
            QueueUrl: queueUrl,
            MessageBody: "This is user upload image queue",
        };
        const sendMessageCommand = new SendMessageCommand(messageSQSParams);
        await sqsClient.send(sendMessageCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "File uploaded successfully" }),
        };
    } catch (error) {
        console.log('error',error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
}
*/

module.exports.fetchUserImage = async (event) => {
    try {
        const { id } = event.pathParameters;
        const folder = `${id}/`;

        // Fetch image from S3
        const getParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folder}${id}.jpg`,
        };

        const command = new GetObjectCommand(getParams);
        const response = await s3Client.send(command);

        // Retrieve image data from the response
        const imageBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            response.Body.on("data", (chunk) => chunks.push(chunk));
            response.Body.on("error", (error) => reject(error));
            response.Body.on("end", () => resolve(Buffer.concat(chunks)));
        });

        // Convert the image data to base64
        const imageData = imageBuffer.toString("base64");

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "image/jpeg", // Replace with the appropriate content type if using a different image format
            },
            body: imageData,
            isBase64Encoded: true,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

module.exports.createUser = async (req, res) => {

    try {
        const { name, email } = JSON.parse(req.body);
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
        });

        const message = JSON.stringify(userItem);
        // Send message to SNS topic
        const topicArn = process.env.USER_TOPIC_ARN // Replace with your SNS topic ARN
        const messageParams = {
            TopicArn: topicArn,
            Message: `You have successfully saved user details - ${message} `,
        };
        const publishCommand = new PublishCommand(messageParams);
        await snsClient.send(publishCommand);

        // Send user creation message to SQS queue for further processing
        // const messageSQSParams = {
        //     QueueUrl: process.env.SQS_QUEUE_ARN,
        //     MessageBody: "This is user creation queue",
        // };
        // const sendMessageCommand = new SendMessageCommand(messageSQSParams);
        // await sqsClient.send(sendMessageCommand);

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
        });

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
        });

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
