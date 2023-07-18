const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
	mode: 'development', // 'production' or 'development' for local testing
	entry: slsw.lib.entries,
	output: {
		libraryTarget: 'commonjs',
		path: path.join(__dirname, '.webpack'),
		filename: '[name].js',
	},
	target: 'node',
	externals: ['aws-sdk'], // Exclude AWS SDK from the bundle
	module: {
		rules: [
		// Add your loaders here as needed
		// Example loader for Babel
		{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
				},
			},
		},
		],
	},
};
