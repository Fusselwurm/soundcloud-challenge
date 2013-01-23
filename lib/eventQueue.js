var
	// object with sequence numbers as property names and event data strings as property values
	events = {},
	nextSeq = 1,
	EvtEmitter = require('events').EventEmitter,
	emitEvents = function () {
		while (events[nextSeq]) {

			module.exports.emit('next', events[nextSeq]);
			delete events[nextSeq];

			nextSeq += 1;
		}

	};

module.exports = new EvtEmitter();

module.exports.reset = function () {
	events = {};
	nextSeq = 1;
};

module.exports.add = function (event) {
	var
		tmp = event.split('|').shift(),
		seq = parseInt(tmp, 10);

	if (seq < 1) { // note: implicit type casting intentional!
		throw new Error('invalid sequence number');
	}

	events[seq] = event;

	if (seq === nextSeq) {
		emitEvents();
	}
};

module.exports.getWaitingEvents = function () {
	return events;
};