module.exports = function (userid) {

	var
		followers = [],
		clients = [];

	return {
		getUserid: function () {
			return userid;
		},
		follow: function (followerid) {
			if ((parseInt(followerid, 10) !== followerid) || (followerid < 0)) {
				throw new Error('me want integer userid > 0!');
			}
			if (followerid === userid) {
				return;
			}
			if (followers.indexOf(followerid) === -1) {
				followers.push(followerid);
			}
		},
		sendEvent: function (event) {
			clients.forEach(function (client) {
				client.write(event + '\r\n');
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