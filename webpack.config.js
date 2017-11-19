var path = require('path');
var webpack = require('webpack');
var os = require('os');
var webpackConfig = require('./webpack.config');

var ifaces = os.networkInterfaces();
var ip = getIP();

var now = new Date();

function getIP() {
	var ifaces = os.networkInterfaces();
	var ifaceArray = [];

	for (var key in ifaces) {
		if (ifaces.hasOwnProperty(key)) {
			ifaceArray = ifaceArray.concat(ifaces[key]);
		}
	}

	var iface = ifaceArray.filter(iface => iface.family === 'IPv4' && iface.address !== '127.0.0.1')[0];

	return iface ? iface.address : 'localhost';
}

console.log('/*===============================================*/');
console.log('Your ip is', ip);
console.log('/*===============================================*/');
console.log(`Restarted at: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
console.log('/*===============================================*/');


module.exports = {
	entry: {
		'index': './demo/index.ts', 
	},

	output: Object.assign({}, webpackConfig.output, {
		publicPath: `http://${ip}:8080/js/`,
	}),

	devServer: {
		noInfo: true,
	},

	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				use: 'babel-loader',
			},
			{
				test: /\.tsx?$/,
				exclude: /(node_modules)/,
				use: ['babel-loader', 'ts-loader'],
			},
			{
				test: /\.(pug|jade)$/,
				use: ['pug-loader'],
			},
			{
				test: /\.json$/,
				use: 'json-loader',
			},
		],
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.pug'],
		alias: {
			scripts: path.resolve(__dirname, './src/scripts'),
		},
	},

	plugins: [
		new webpack.DefinePlugin({
			__DEVELOPMENT__: true,
			__DEVTOOLS__: false,
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
	],
};
