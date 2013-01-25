module.exports = function (event) {
	var
		bits = event.split('|'),
		seq, type, from, to;

	// just not to seem too lazy: verify data
	seq = parseInt(bits[0], 10) || 0;
	if (seq < 1) {
		throw new Error('invalid sequence number ' + bits[0]);
	}
	type = bits[1];
	if (!type || type.length > 1 || ('FUBPS'.indexOf(type) === -1)) {
		throw new Error('invalid event type ' + JSON.stringify(type));
	}
	from = parseInt(bits[2], 10) || 0;
	if (from < 1) {
		if  (type !== 'B') {
			throw new Error('missing or invalid "from" user ' + bits[2] + ' for event type ' + type);
		}
	} else if (type === 'B') {
		throw new Error('"from" user is not allowed for event type ' + type);
	}

	to = parseInt(bits[3], 10) || 0;
	if (to < 1) {
		if (['B', 'S'].indexOf(type) === -1) {
			throw new Error('missing or invalid "to" user ' + bits[3] + ' for event type ' + type);
		}
	} else if (['B', 'S'].indexOf(type) !== -1) {
		throw new Error('"to" user not allowed for event type ' + type);
	}

	return {
		seq: seq,
		type: type,
		to: to,
		from: from,
		raw: event
	};
};