var
	newEvent = require(__dirname + '/newEvent.js'),
	userFactory;

exports.setUserFactory = function (o) {
	userFactory = o;
};

exports.processEvent = function (oEvent) {
	var
		users,
		userids;

	switch (oEvent.type) {
	case 'P':
		userFactory.getUser(oEvent.to).sendEvent(oEvent);
		break;
	case 'F':
		userFactory.getUser(oEvent.from).follow(oEvent.to);
		break;
	case 'U':
		userFactory.getUser(oEvent.from).unfollow(oEvent.to);
		break;
	case 'B':
		users = userFactory.getAllUsers();
		Object.getOwnPropertyNames(users).forEach(function (userid) {
			users[userid].sendEvent(oEvent);
		});
		break;
	case 'S':
		userids = userFactory.getUser(oEvent.from).getFollowers();
		userids.forEach(function (userid) {
			userFactory.getUser(userid).sendEvent(oEvent);
		});
		break;
	default:
		throw new Error('dafuq? unknown event type' + oEvent.type + '. you may smash your head on the keyboard... now!');
	}
};