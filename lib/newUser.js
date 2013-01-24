var isValidUserid = function (v) {
	return parseInt(v, 10) === v && v >= 0;
};

module.exports = function (userid) {

	var
		followers = [],
		clientSockets = [];

	return {
		getUserid: function () {
			return userid;
		},
		follow: function (followerid) {
			if (!isValidUserid(followerid)) {
				throw new Error('invalid userid: ' + followerid);
			}
			if (followerid === userid) {
				return;
			}
			if (followers.indexOf(followerid) === -1) {
				followers.push(followerid);
			}
		},
		sendEvent: function (oEvent) {
			clientSockets.forEach(function (client) {
				client.write(oEvent.raw + '\r\n');
			});
		},
		unfollow: function (userid) {
			var idx = followers.indexOf(userid);
			if (idx !== -1) {
				followers.splice(idx, 1);
			}
		},
		getFollowers: function () {
			return followers;
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