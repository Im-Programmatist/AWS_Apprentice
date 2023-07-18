1. Install aws cli 
    - https://aws.amazon.com/cli/ 
    - Choose "Install the AWS CLI version 2" section
    - "MSI installer" link to download the AWS CLI installer for Windows.
    -  AWS CLI to be available to all users then select "Install for all users."
    - check installation -$ aws --version

2. Install serverless global package
    - npm install -g serverless
    - The Serverless Framework is a popular tool for developing, deploying, and managing serverless applications. 

3. Configure AWS CLI Profile 
    - .aws folder will be created in C:/users/%user_profile_name%/.aws
    - inside .aws we need to configure all the setup
    - Manually can add 2 files  1. config & 2. credentials and code in it as per below -
        - 1. config 
            [default]
            region = ap-south-1
            output = json

            [profile programmatist-admin]
            region = ap-south-1
            output = json

            [profile kchetanpatil-admin]
            region = ap-south-1
            output = json
        - 2. credentials
            [default]
            aws_access_key_id = AKI---------5
            aws_secret_access_key = F-------------------------N

            [programmatist-admin]
            aws_access_key_id = AKI---------5
            aws_secret_access_key = F-------------------------N

            [kchetanpatil-admin]
            aws_access_key_id = Ad09----2909h
            aws_secret_access_key = G------------+ud--+/
        OR
    - Using command - inside windows power shell/cmd
        - $ aws configure --profile profile_name & enter
        - This command will ask the same information as above in each file
    - We can create multiple profiles with AWS CLI

4. We can use each profile to get AWS feature/service details using command
    - $ aws s3 ls --profile profile1
    - $ aws ec2 describe-instances --profile profile2
    
5. set the AWS_PROFILE environment variable:
    - For Command Prompt:
        $ setx AWS_PROFILE "profile_name"
    - For PowerShell:
        $ [Environment]::SetEnvironmentVariable("AWS_PROFILE", "profile_name", "User")

6. To see default configuration in AWS Cli 
    - $ aws configure list

7. Serverless API 
    - Create New Folder for api

    - Initialize node project in folder : $ npm init -y

    - $ npm install aws-sdk express serverless-http serverless-offline serverless-webpack
        - aws-sdk: The AWS SDK for Node.js, which allows interaction with AWS services.
        - express: A popular Node.js web framework for handling HTTP requests.
        - serverless-http: A utility that adapts an Express.js app to work with AWS Lambda.
        - serverless-offline: A plugin for local development and testing of serverless applications.
        - serverless-webpack: A Serverless Framework plugin to build your lambda functions with Webpack. This plugin is for you if you want to use the latest Javascript version with babel.

    - Create express app with routes and middleware and export it.
        - 3 files are important - 1:index or server js file, 2:handler.js file & 3. serverless.yml 
        - Export the app wrapped with serverless-http:
        - Export normal express app with -: module.exports.handler_name = serverless(app); // (this is inside index.js file , this file name is required while mentioning function name)

    - Create the Serverless Configuration with yaml file present in file structure - serverless.yml 
        - inside serverless.yaml provide service, name, stage, runtime(platform) and region etc
        - define lambda function name under function node - 'handler : index(handle mention file).handler_name' 
        - we can add serverless plugin to test app offline
        - Add the serverless-offline plugin for local development:
            plugins:
            - serverless-offline
        - Under event node we can mention entry url to the application and manage requests from here
            events:
            - http:
                path: /
                method: any

    - Deploy and Test the API
        - $ npx serverless deploy // OR $ serverless deploy
        - After the deployment is successful, note the API endpoint URL.
        - We can test API by sending HTTP requests to the endpoint URL using tools like cURL or Postman.

    - Run application offline 
        - serverless offline start --noPrependStageInUrl Or sls offline start --noPrependStage
        - Or add script in package.json
            "scripts": {
                "start": "sls offline start" // OR sls offline start --noPrependStage
            }

    - Before deploy we can bundle the application using webpack
        - install serverless-webpack package - $ npm install --save-dev serverless-webpack webpack webpack-node-externals
        - configure webpack in webpack-config.js with required loader for the application
        - Then mention custom configuration and plugin in serverless.yml 
            plugins:
                - serverless-webpack
            custom:
                webpack:
                    webpackConfig: ./webpack.config.js
                    includeModules: true 
        - create bundle using - $ npx serverless webpack
        - $ npx serverless deploy

- we can get sample aws-node application 
    - $ sls create -t aws-nodejs-ecma-script -n service-name(which-mention-in-serverless.yml)