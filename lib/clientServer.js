/**
 * interface:
 * - start:bool
 * - stop:bool
 * emits 'connect' event, passing userid, socket to handler
 * emits 'disconnect' event, passing userid, socket to handler
 */

var net = require('net'),
	EvtEmitter = require('events').EventEmitter,
	server,
	that = module.exports = new EvtEmitter();

that.start = function () {
	if (server) {
		return false;
	}
	server = net.createServer(function (socket) {
		var userid;

		console.log('client connected, waiting for data...');

		socket.on('end', function () {
			if (userid) {
				that.emit('disconnect', userid, socket);
			} else {
				console.log('saw disconnect without ever knowing the userid. tsk.')
			}
		});
		socket.on('error', function () {
			console.log('error o.O');
			console.log(arguments);
		});
		socket.on('data', function (data) {
			userid = parseInt(data.toString().trim(), 10);
			if (userid) {
				that.emit('connect', userid, this); // "this" would be the socket here, I hope ^^
			} else {
				console.log('wtf? I didnt expect that from a client: ' + JSON.stringify(data));
			}
		});
	}).listen(9099);

	server.on('error', function () {
		console.log('ÖRKS client server error');
		console.log(arguments);
	});
	return true;
};

that.stop = function () {
	if (server) {
		server.close();
		return true;
	}
	return false;
};