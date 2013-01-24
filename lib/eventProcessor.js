var
	userFactory,
	// using pseudo-classical form here for maximum inconsistency ;p
	Evt = function (seq, type, from, to) {
		this.seq = seq;
		this.type = type;
		this.to = to;
		this.from = from;
	},
	parseEvent = function (event) {
		var
			bits = event.split('|'),
			seq, type, from, to;
		// just not to seem too lazy: verify data
		seq = parseInt(bits[0], 10);
		if (seq < 1) {
			throw new Error('invalid sequence number ' + bits[0]);
		}
		type = bits[1];
		if (!type || type.length > 1 || ('FUBPS'.indexOf(type) === -1)) {
			throw new Error('invalid event type ' + JSON.stringify(type));
		}
		from = parseInt(bits[2]);
		if (from < 1 && (type !== 'B')) {
			throw new Error('missing or invalid "from" user ' + bits[2] + ' for event type ' + type);
		}
		to = parseInt(bits[3]);
		if (to < 1 && (['B', 'S'].indexOf(type) === -1)) {
			throw new Error('missing or invalid "to" user ' + bits[3] + ' for event type ' + type);
		}

		return new Evt(seq, type, from, to);
	};



exports.setUserFactory = function (o) {
	userFactory = o;
};

exports.processEvent = function (sEvent) {
	var
		oEvent = parseEvent(sEvent),
		users,
		userids;

	switch (oEvent.type) {
	case 'P':
		userFactory.getUser(oEvent.to).sendEvent(sEvent);
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
			users[userid].sendEvent(sEvent);
		});
		break;
	case 'S':
		userids = userFactory.getUser(oEvent.from).getFollowers();
		userids.forEach(function (userid) {
			userFactory.getUser(userid).sendEvent(sEvent);
		});
		break;
	default:
		throw new Error('dafuq? unknown event type' + oEvent.type + '. you may smash your head on the keyboard... now!');
	}
};