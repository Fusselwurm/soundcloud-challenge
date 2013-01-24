var eventQueue = require(__dirname + '/../lib/eventQueue.js'),
	randomEvent;

describe('eventQueue', function () {

	beforeEach(function () {
		eventQueue.reset();
		randomEvent = function (seq) {
			randomEvent[seq] = {
				seq: seq,
				type: 'B',
				from: 1,
				to: 2
			};
			return randomEvent[seq];
		};
	});

	it('adds new events', function () {

		var events;

		eventQueue.add(randomEvent(3));
		eventQueue.add(randomEvent(6));

		events = eventQueue.getWaitingEvents();

		expect(Object.getOwnPropertyNames(events).length).toBe(2);
		expect(events[3].seq).toBe(3);
		expect(events[6].seq).toBe(6);
	});

	it('emits events as soon as and only if they can be sent in correct order', function () {

		spyOn(eventQueue, 'emit');

		// add messages that may not be processed yet...

		eventQueue.add(randomEvent(5));
		eventQueue.add(randomEvent(2));
		eventQueue.add(randomEvent(3));

		expect(eventQueue.emit).not.toHaveBeenCalled();

		// add one message to trigger processing...

		eventQueue.add(randomEvent(1));

		expect(eventQueue.emit).toHaveBeenCalled();

		expect(eventQueue.emit.calls[0].args[1]).toBe(randomEvent[1]);
		expect(eventQueue.emit.calls[1].args[1]).toBe(randomEvent[2]);
		expect(eventQueue.emit.calls[2].args[1]).toBe(randomEvent[3]);
		expect(eventQueue.emit.mostRecentCall.args[1]).toBe(randomEvent[3]);

		// event 5 may not have been processed yet. it waits for 4:

		eventQueue.add(randomEvent(4));

		expect(eventQueue.emit.calls[3].args[1]).toBe(randomEvent[4]);
		expect(eventQueue.emit.calls[4].args[1]).toBe(randomEvent[5]);

		// just to be sure eventQueue is still sane, do another one
		// (assertion creep has begun. if i do another five, please shoot me)

		eventQueue.add(randomEvent(6));


		expect(eventQueue.emit.calls[5].args[1]).toBe(randomEvent[6]);
		expect(eventQueue.emit.mostRecentCall.args[1]).toBe(randomEvent[6]);



	});

	it('forgets events that have been processed!', function () {

		eventQueue.add(randomEvent(5));
		eventQueue.add(randomEvent(2));
		eventQueue.add(randomEvent(3));
		expect(Object.getOwnPropertyNames(eventQueue.getWaitingEvents()).length).toBe(3);
		eventQueue.add(randomEvent(1));
		eventQueue.add(randomEvent(4));
		eventQueue.add(randomEvent(6));

		expect(Object.getOwnPropertyNames(eventQueue.getWaitingEvents()).length).toBe(0);
	});

});