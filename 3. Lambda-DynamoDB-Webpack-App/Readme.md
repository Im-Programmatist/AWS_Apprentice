## application using webpack
- install serverless-webpack package - $ npm install --save-dev serverless-webpack webpack webpack-node-externals
- install bable and @babel/preset-env
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

**Also Can refer - https://www.serverless.com/plugins/serverless-plugin-webpack**