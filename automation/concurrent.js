module.exports = {
	app: {
		tasks: ['watch', 'scripts', 'nodemon'],
		options: {
			logConcurrentOutput: true,
			limit: 4,
		},
	},
};
