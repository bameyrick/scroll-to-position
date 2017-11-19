module.exports = {
	debug: {
		script: '../dev-server/index.js',
		options: {
			nodeArgs: ['--debug'],
			env: {
				port: 3000,
			},
			cwd: __dirname,
			watch: ['../'],
			ignore: ['../src/', '../build/'],
			livereload: true,
		},
	},
};
