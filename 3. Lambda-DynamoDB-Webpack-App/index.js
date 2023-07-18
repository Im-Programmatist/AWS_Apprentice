const express = require("express");
const AWS = require("aws-sdk");
const uuid = require("uuid");

const app = express();
const router = express.Router();
app.use(express.json());

// Configure AWS SDK
const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.get('/', (req, res)=>{
    res.send({'message':'Welcome to lambda-dynamodb-apigateway-webpack demo application'});
});

// Define API routes
router.get("/items", async (req, res) => {
	try {
		const params = {
			TableName: "Items", 
		};
		const result = await dynamoDB.scan(params).promise();
		res.json(result.Items);
	} catch (error) {
		console.error("Error retrieving items:", error);
		res.status(500).json({ error: "Failed to retrieve items" });
	}
});

router.post("/items", async (req, res) => {
	try {
		const { name, description } = req.body;
		const params = {
			TableName: "Items", 
			Item: {
				id: uuid.v4(),
				name,
				description,
			},
		};
		await dynamoDB.put(params).promise();
		res.status(201).json({ message: "Item created successfully" });
	} catch (error) {
		console.error("Error creating item:", error);
		res.status(500).json({ error: "Failed to create item" });
	}
});

// Mount the router to the app

app.use("/functions/", router);

// app.listen('4040', '0.0.0.0', (err) => {
//     if(err) throw err;
//     console.log(`Lambda severless app listening at- localhost:3030`);
// })

module.exports = app;
