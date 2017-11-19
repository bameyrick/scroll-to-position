var webpackDevConfig = require('../webpack.config.js');

module.exports = {
	options: {
		webpack: webpackDevConfig,
		publicPath: webpackDevConfig.output.publicPath,
		host: '0.0.0.0',
		disableHostCheck: true,
	},
	start: {
		webpack: {
			devtool: 'eval',
		},
	},
};
