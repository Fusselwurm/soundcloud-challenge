var newUser = require(__dirname + '/../lib/newUser.js');

//noinspection JSHint
describe('newUser', function () {
	it('returns a new object on each call', function () {
		expect(newUser(42)).not.toBe(newUser(42));
	});
});
describe('newUser return value', function () {

	var user;

	beforeEach(function () {
		user = newUser(42);
	});


	it('can add and remove clients', function () {
		var
			c1 = {},
			c2 = [];

		expect(user.getClients().length).toBe(0);
		user.addClient(c1);
		user.addClient(c2);
		expect(user.getClients().length).toBe(2);
		user.removeClient(c1);
		expect(user.getClients().length).toBe(1);
		user.removeClient(c1);
		expect(user.getClients().length).toBe(1);
		user.removeClient(c2);
		expect(user.getClients().length).toBe(0);
	});
	it('does send events to all clients', function () {

		var
			event = {
				raw: 'B|X|Y'
			}, // some dummy data. user is not the one validating event types.
			socket1 = {
				write: function () {}
			},
			socket2 = {
				write: function () {}
			};

		spyOn(socket1, 'write');
		spyOn(socket2, 'write');

		user.addClient(socket1);
		user.addClient(socket2);
		user.sendEvent(event);

		expect(socket1.write).toHaveBeenCalledWith(event.raw + '\r\n');
		expect(socket2.write).toHaveBeenCalledWith(event.raw + '\r\n');

	});
});