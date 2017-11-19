module.exports = function(grunt) {
	// Automatically load our grunt tasks
	require('load-grunt-tasks')(grunt);

	// Grunt task loader options
	var options = {
		config: {
			src: 'automation/*.js',
		},
		pkg: grunt.file.readJSON('package.json'),
		paths: {
			pug: 'demo',
			html: 'build',
			css: 'demo',
			build: 'build',
		},
	};

	var configs = require('load-grunt-configs')(grunt, options);
	grunt.initConfig(configs);

	// Views
	grunt.registerTask('templates', ['pug:dev']);

	// Scripts
	grunt.registerTask('scripts', ['webpack-dev-server:start']);

	// dev
	grunt.registerTask('default', ['clean', 'templates', 'concurrent:app']);
};
