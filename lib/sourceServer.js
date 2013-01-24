var net = require('net'),
	EvtEmitter = require('events').EventEmitter,
	server,
	that = module.exports = new EvtEmitter();

that.start = function () {
	if (server) {
		return;
	}
	server = net.createServer(function (listener) {
		console.log('source connected.');

		listener.on('end', function() {
			console.log('source disconnected');
		});
		listener.on('error', function () {
			console.log('error o.O');
			console.log(arguments);
		});
		listener.on('data', function (data) {
			data = data.toString().trim().split('\r\n');
			// It looks like "data" is always a crlf terminated chunk, that is, contains always whole events
			// TODO I should not rely on that, it's not explicitly stated in the protocol

			console.log('source data ftw: ' + data.length  + ' events');
			data.forEach(function (sEvent) {
				that.emit('event', sEvent);
			});

		});
	}).listen(9090);

	server.on('error', function (e) {
		console.log('ÖRKS source server error');
		console.log(arguments);
	});
};

that.stop = function () {
	if (server) {
		server.close();
	}
};