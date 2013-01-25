var
	userFactory,
	followerGraph;

exports.setUserFactory = function (o) {
	userFactory = o;
};

exports.setFollowerGraph = function (o) {
	followerGraph = o;
};

exports.processEvent = function (oEvent) {
	var
		users;

	switch (oEvent.type) {
	case 'P':
		userFactory.getUser(oEvent.to).sendEvent(oEvent);
		break;
	case 'F':
		followerGraph.follow(oEvent.from, oEvent.to);
		userFactory.getUser(oEvent.to).sendEvent(oEvent);
		break;
	case 'U':
		followerGraph.unfollow(oEvent.from, oEvent.to);
		break;
	case 'B':
		users = userFactory.getAllUsers();
		Object.getOwnPropertyNames(users).forEach(function (userid) {
			users[userid].sendEvent(oEvent);
		});
		break;
	case 'S':
		users = userFactory.getAllUsers();

		followerGraph.getFollowers(oEvent.from).forEach(function (userid) {
			users[userid].sendEvent(oEvent);
		});
		break;
	default:
		throw new Error('dafuq? unknown event type' + oEvent.type + '. you may smash your head on the keyboard... now!');
	}
};