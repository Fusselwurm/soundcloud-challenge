var eventQueue = require(__dirname + '/../lib/eventQueue.js');

describe('eventQueue', function () {

	beforeEach(function () {
		eventQueue.reset();
	});

	it('adds new events', function () {

		var events;

		eventQueue.add('3|BLA');
		eventQueue.add('6|BLA');

		events = eventQueue.getWaitingEvents();

		expect(Object.getOwnPropertyNames(events).length).toBe(2);
		expect(events[3]).toBe('3|BLA');
		expect(events[6]).toBe('6|BLA');
	});

	it('emits events as soon as and only if they can be sent in correct order', function () {

		spyOn(eventQueue, 'emit');

		// add messages that may not be processed yet...

		eventQueue.add('5|BLI');
		eventQueue.add('2|BLA');
		eventQueue.add('3|BLO');

		expect(eventQueue.emit).not.toHaveBeenCalled();

		// add one message to trigger processing...

		eventQueue.add('1|GO');

		expect(eventQueue.emit).toHaveBeenCalled();

		expect(eventQueue.emit.calls[0].args[1]).toBe('1|GO');
		expect(eventQueue.emit.calls[1].args[1]).toBe('2|BLA');
		expect(eventQueue.emit.calls[2].args[1]).toBe('3|BLO');
		expect(eventQueue.emit.mostRecentCall.args[1]).toBe('3|BLO');

		// event 5 may not have been processed yet. it waits for 4:

		eventQueue.add('4|...');

		expect(eventQueue.emit.calls[3].args[1]).toBe('4|...');
		expect(eventQueue.emit.calls[4].args[1]).toBe('5|BLI');

		// just to be sure eventQueue is still sane, do another one
		// (assertion creep has begun. if i do another five, please shoot me)

		eventQueue.add('6|...');


		expect(eventQueue.emit.calls[5].args[1]).toBe('6|...');
		expect(eventQueue.emit.mostRecentCall.args[1]).toBe('6|...');



	});

	it('forgets events that have been processed!', function () {

		eventQueue.add('5|BLI');
		eventQueue.add('2|BLA');
		eventQueue.add('3|BLO');
		expect(Object.getOwnPropertyNames(eventQueue.getWaitingEvents()).length).toBe(3);
		eventQueue.add('1|GO');
		eventQueue.add('4|...');
		eventQueue.add('6|...');

		expect(Object.getOwnPropertyNames(eventQueue.getWaitingEvents()).length).toBe(0);
	});

});