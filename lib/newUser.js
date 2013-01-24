var isValidUserid = function (v) {
	return parseInt(v, 10) === v && v >= 0;
};

module.exports = function (userid) {

	var
		followed = [],
		clientSockets = [];

	return {
		getUserid: function () {
			return userid;
		},
		follow: function (followedid) {
			if (!isValidUserid(followedid)) {
				throw new Error('invalid userid: ' + followedid);
			}
			if (followedid === userid) {
				return;
			}
			if (followed.indexOf(followedid) === -1) {
				followed.push(followedid);
			}
		},
		sendEvent: function (oEvent) {
			clientSockets.forEach(function (client) {
				client.write(oEvent.raw + '\r\n');
			});
		},
		unfollow: function (userid) {
			var idx = followed.indexOf(userid);
			if (idx !== -1) {
				followed.splice(idx, 1);
			}
		},
		getFollowed: function () {
			return followed;
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