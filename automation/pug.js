module.exports = {
	dev: {
		options: {
			data: {
				debug: true,
			},
			doctype: 'html',
			pretty: true,
		},

		files: [
			{
				cwd: '<%= paths.pug %>',
				expand: true,
				src: ['**/*.pug', '!**/_*.pug'],
				dest: '<%= paths.html %>',
				ext: '.html',
			},
		],
	},
};
