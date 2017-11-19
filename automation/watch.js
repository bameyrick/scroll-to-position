module.exports = {
	styles: {
		cwd: '<%= paths.css %>',
		files: ['**/*.css'],
		tasks: ['templates'],
		options: {
			spawn: true,
			interrupt: true,
			livereload: true,
		},
	},

	pug: {
		cwd: '<%= paths.pug %>',
		files: ['**/*.pug'],
		tasks: ['templates'],
		options: {
			spawn: true,
			interrupt: true,
			livereload: true,
		},
	},
};
