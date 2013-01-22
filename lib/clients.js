
var net = require('net'),
	server;


exports.start = function () {
	if (server) {
		return;
	}
	server = net.createServer(function (listener) {
		console.log('client connected');

		listener.on('end', function() {
			console.log('client disconnected');
		});
		listener.on('error', function () {
			console.log('error o.O');
			console.log(arguments);
		});
		listener.on('data', function (data) {
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