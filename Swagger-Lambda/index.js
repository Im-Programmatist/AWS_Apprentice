const express = require('express');
const serverless = require('serverless-http');

const swaggerUI = require('swagger-ui-express');
const yamljs = require("yamljs");
const resolveRefs = require("json-refs").resolveRefs;
const http = require("http");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const swaggerDocument = require('./swagger.json');
// var options = {
// 	swaggerOptions: {
// 		url: process.env.SWAGGER_SPEC_URL
//     }
// }
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument,options));
// app.use('/api-docs', function(req, res, next){
// 	console.log(`req`);
//     options.swaggerOptions= {
// 		url: process.env.SWAGGER_SPEC_URL
//     }
// //}, swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));
// }, swaggerUI.serveFiles(swaggerDocument), swaggerUI.setup(options));

// app.get('/api-docs', (req, res) => {
// 	res.send({"message": "Welcome to serverless lambda implementation for swagger"});
// });

//app.listen(3000, () => console.log(`Listening on: 3000`));
//module.exports.handler = serverless(app);

app.get('/', (req, res) => {
	res.send({"message": "Welcome to serverless lambda implementation for swagger"});
});

 
const multiFileSwagger = (root) => {
    const options = {
        filter: ["relative", "remote"],
        loaderOptions: {
            processContent: function (res, callback) {
                callback(null, yamljs.parse(res.text));
            },
        },
    };

    return resolveRefs(root, options).then(
        function (results) {
            return results.resolved;
        },
        function (err) {
            console.log(err.stack);
        }
    );
};

const createServer = async () => {
    const swaggerDocument = await multiFileSwagger(
		//yamljs.load(path.resolve(__dirname, "./swagger-xpath.yaml"))
		yamljs.load(path.resolve(__dirname, "./swagger-gateway.yaml"))
    );
    app.use('/apiDocs', function(req, res, next){
        //swaggerDocument.servers[0].variables.host.default = `${req.protocol}://${req.get('host')}/api`;
        //swaggerDocument.servers[0].variables.schema.default = `${req.protocol}`;
        //swaggerDocument.servers[0].variables.host.default = `${req.get('host')}`;
        req.swaggerDoc = swaggerDocument;
        next();
    }, swaggerUI.serveFiles(swaggerDocument), swaggerUI.setup());
	const server = http.createServer(app);
    return server;
};
  
createServer()
.then((server) => {
    const port = 9091;
    server.listen(port);
    console.log(`[Deal-Calc-APP] App running on: ${port}`);
    console.log(`[SWAGGER-APP] Swagger UI available with path: http://localhost/${port}/apiDocs`);
    module.exports = app;
})
.catch((err) => {
    console.error(err.stack);
    process.exit(1);
});

