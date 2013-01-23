
var net = require('net'),
	server;


exports.start = function () {
	if (server) {
		return;
	}
	server = net.createServer(function (socket) {
		console.log('client connected');

		socket.on('end', function() {
			console.log('client disconnected');
		});
		socket.on('error', function () {
			console.log('error o.O');
			console.log(arguments);
		});
		socket.on('data', function (data) {
			console.log('client data ftw: ' + data);
		});
	}).listen(9099);

	server.on('error', function (e) {
		console.log('ÖRKS client server error');
		console.log(arguments);
	});
};

exports.stop = function () {
	if (server) {
		server.close();
	}
};