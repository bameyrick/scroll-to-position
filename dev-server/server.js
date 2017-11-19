// Runs a local web server to host files
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack.config';

const app = express();

app.use('/', express.static(path.join(__dirname, '../build')));

const compiler = webpack(config);

// Start the server
const server = app.listen(3000, function() {
	const host = 'localhost';
	const port = server.address().port;
	console.log('Running a local server at http://%s:%s', host, port);
});
