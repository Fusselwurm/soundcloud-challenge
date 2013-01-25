var newEvent = require(__dirname + '/../lib/newEvent.js');

//noinspection JSHint
describe('newEvent', function () {
	it('parses follows', function () {
		['1|F|6|10', '445|F|9879435|23134'].forEach(function (val) {
			var e = newEvent(val),
				integerBits = val.split('|').map(function (s) {
					return parseInt(s, 10);
				});
			expect(e).toBeTruthy();
			expect(e.type).toBe('F');
			expect(e.seq).toBe(integerBits[0]);
			expect(e.from).toBe(integerBits[2]);
			expect(e.to).toBe(integerBits[3]);
		});

	});
	it('parses unfollows', function () {
		['1|U|6|10', '445|U|9879435|23134'].forEach(function (val) {
			var e = newEvent(val),
				integerBits = val.split('|').map(function (s) {
					return parseInt(s, 10);
				});
			expect(e).toBeTruthy();
			expect(e.type).toBe('U');
			expect(e.seq).toBe(integerBits[0]);
			expect(e.from).toBe(integerBits[2]);
			expect(e.to).toBe(integerBits[3]);
		});
	});
	it('parses status updates', function () {
		['1|S|6', '445|S|9879435'].forEach(function (val) {
			var e = newEvent(val),
				integerBits = val.split('|').map(function (s) {
					return parseInt(s, 10);
				});
			expect(e).toBeTruthy();
			expect(e.type).toBe('S');
			expect(e.seq).toBe(integerBits[0]);
			expect(e.from).toBe(integerBits[2]);
			expect(e.to).toBe(0);
		});
	});
	it('parses broadcasts', function () {
		['2|B', '445|B'].forEach(function (val) {
			var e = newEvent(val);
			expect(e).toBeTruthy();
			expect(e.type).toBe('B');
			expect(e.seq).toBe(parseInt(val.split('|')[0], 10));
			expect(e.to).toBe(0);
			expect(e.from).toBe(0);
		});
	});
	it('parses private messages', function () {
		['1|P|6|10', '445|P|9879435|23134'].forEach(function (val) {
			var e = newEvent(val),
				integerBits = val.split('|').map(function (s) {
					return parseInt(s, 10);
				});
			expect(e).toBeTruthy();
			expect(e.type).toBe('P');
			expect(e.seq).toBe(integerBits[0]);
			expect(e.from).toBe(integerBits[2]);
			expect(e.to).toBe(integerBits[3]);
		});
	});
	it('explodes on invalid stuff. in your face, invalid data!', function () {
		[
			'moo', // wildly random
			'0|S|1|10', //seq is bollocks
			'1|X|1|10', '1|PPP|1|10', // type is invalid
			'1|B|1', '1|F|X|X',  // from is bs or not allowed
			'1|F|3|X', '645|S|34|36' // to is bs or not allowed
		].forEach(function (s) {
				expect(function () {
					newEvent(s);
					console.log('wait... that shouldnt have worked!' + s);
				}).toThrow();
			});
	});

	it('remembers its raw data. has to.', function () {
		expect(newEvent('1|B').raw).toBe('1|B');
	});
});