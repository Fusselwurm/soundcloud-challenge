var isValidUserid = function (v) {
	return parseInt(v, 10) === v && v >= 0;
};

module.exports = function (userid) {

	var
		followers = [],
		clients = [];

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
			clients.forEach(function (client) {
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
			if (clients.indexOf(client) === -1) {
				clients.push(client);
			}
		},
		removeClient: function (client) {
			var idx = clients.indexOf(client);
			if (idx !== -1) {
				clients.splice(idx, 1);
			}
		},
		getClients: function () {
			return clients;
		}
	};

};

module.exports.isValidUserid = isValidUserid;