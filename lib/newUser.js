var isValidUserid = function (v) {
	return parseInt(v, 10) === v && v >= 0;
};

module.exports = function (userid) {

	var
		clientSockets = [];

	return {
		getUserid: function () {
			return userid;
		},
		sendEvent: function (oEvent) {
			clientSockets.forEach(function (client) {
				client.write(oEvent.raw + '\r\n');
			});
		},
		addClient: function (client) {
			if (clientSockets.indexOf(client) === -1) {
				clientSockets.push(client);
			}
		},
		removeClient: function (client) {
			var idx = clientSockets.indexOf(client);
			if (idx !== -1) {
				clientSockets.splice(idx, 1);
			}
		},
		getClients: function () {
			return clientSockets;
		}
	};

};

module.exports.isValidUserid = isValidUserid;