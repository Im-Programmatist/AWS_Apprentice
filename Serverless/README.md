# Serverless Commands & Notes

## 1. $ npm install serverless -g
## 2. $ mkdir coding-round-evaluator && cd coding-round-evaluator
## 3. $ serverless create --template aws-nodejs --path candidate-service --name candidate 
   ## OR
   ## $ serverless create -t aws-nodejs
## 4. $ serverless deploy ---> to deploye the created api/project on lambda with cloud formation
##    OR   serverless deploy function -f <function-name>  -->only lambda not cloud formation
## 5. To call get request from terminal - $ curl -X POST https://05ccffiraa.excte-api.us-east-1.amazonaws.com/dev/candidates   ---> to test the api response
## 6. To call post request from terminal -  $ curl -H "Content-Type: application/json" -X POST -d '{"fullname":"chetan korde","email": "chetan@abc.com", "experience":12}' https://05ccffiraa.exute-api.us-east-1.amazonaws.com/dev/candidates
   to test post api and save data in db
## 7. Invoking Functions Locally and Remotely - $ sls invoke local -f function-name -p event.json
## 8. $ sls logs -f candidateDetails -t  ----> Tailing the Logs

**Configure serverless with aws -  $ serverless config credentials --provider aws --key <key> --secret <secret-key>**

serverless config credentials --provider aws --key AKIAY3UEA4SBI4IIX3VQ --secret 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

***If we are exporting express application over serverless then install - $ npm install --save-dev serverless-http**

**https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb**

**https://blog.appsignal.com/2022/03/23/build-serverless-apis-with-nodejs-and-aws-lambda.html**

**https://app.serverless.com/chetankorde**

**https://www.youtube.com/watch?v=1IjTYzOfSMc**

**https://console.serverless.com/chetankorde/metrics/awsLambda?globalEnvironments=dev&globalNamespace=serverless-practice&globalRegions=ap-south-1&globalScope=awsLambda&globalTimeFrame=15m**

**https://www.serverless.com/plugins/serverless-plugin-include-dependencies**

**https://dashbird.io/blog/how-to-deploy-nodejs-application-aws-lambda/**


**https://bitbucket.org/blog/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework**

