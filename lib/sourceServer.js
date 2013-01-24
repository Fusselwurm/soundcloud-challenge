var net = require('net'),
	EvtEmitter = require('events').EventEmitter,
	server,
	newEvent = require(__dirname + '/newEvent.js'),
	that = module.exports = new EvtEmitter();

that.start = function () {
	if (server) {
		return;
	}
	server = net.createServer(function (listener) {

		var nEvents = 0;

		console.log('source connected.');

		listener.on('end', function() {
			console.log('source disconnected after sending ' + nEvents + ' events');
		});
		listener.on('error', function () {
			console.log('error o.O');
			console.log(arguments);
		});
		listener.on('data', function (raw) {

			// It looks like "data" is always a crlf terminated chunk, that is, contains always whole events
			// TODO I should not rely on that, it's not explicitly stated in the protocol

			// okay. the source sends messages not \r\n but only \n delimited. Be nice.
			var data = raw.toString().trim().split('\n').map(function (line) {
					return line.trim();
				}).filter(function (line) {
					return line;
				});

			data.forEach(function (sEvent) {
				try {
					that.emit('event', newEvent(sEvent));
					nEvents += 1;
				} catch (e) {
					console.log('ERROR. invalid data in ' + JSON.stringify(raw.toString()));
				}
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