import * as http from "http";
import * as net from "net";
import * as express from 'express';
import * as proxy from 'express-http-proxy';

process.on('uncaughtException', e => console.warn('*** ' + e));

function logRequest(req) {
	console.log(req.method + ' ' + req.url);
	for (var i in req.headers) {
		console.log(' * ' + i + ': ' + req.headers[i]);
	}
}

const app = express();
app.use('/', (req, res, next) => {
	logRequest(req);
	proxy(req.url)(req, res, next);
})

// standard HTTP server that will pass requests
// to the proxy
const server = http.createServer(app);

// when a CONNECT request comes in, the 'connect'
// event is emitted
server.on('connect', function(req, socket, head) {
	logRequest(req);
	// URL is in the form 'hostname:port'
	const parts = req.url.split(':', 2);
	// open a TCP connection to the remote host
	const conn = net.connect(parts[1], parts[0], function() {
		// respond to the client that the connection was made
		socket.write("HTTP/1.1 200 OK\r\n\r\n");
		// create a tunnel between the two hosts
		socket.pipe(conn);
		conn.pipe(socket);
	});
});

server.listen(process.env['PORT'] || 3333);
