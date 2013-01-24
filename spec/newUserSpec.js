var newUser = require(__dirname + '/../lib/newUser.js');

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

	it('adds followers when "follow" is called', function () {
		var
			tmpFollowers;

		expect(user.getFollowed().length).toBe(0);

		user.follow(21);
		user.follow(27);

		tmpFollowers = user.getFollowed();
		expect(tmpFollowers.length).toBe(2);
		expect(tmpFollowers.indexOf(21)).not.toBe(-1);
		expect(tmpFollowers.indexOf(27)).not.toBe(-1);

	});
	it('will not add followers twice', function () {
		user.follow(1);
		user.follow(2);
		user.follow(2);
		expect(user.getFollowed().length).toBe(2);
	});
	it('will explode on invalid follower ids', function () {
		var
			invalidValues = [undefined, -1, 'moo', null, 4.4],
			callWithInvalid = function () {
				user.follow(invalidValues.shift());
			};

		invalidValues.forEach(function () {
			expect(callWithInvalid).toThrow();
		});

	});

	it('will unfollow people', function () {

		user.follow(2);
		user.follow(3);
		user.unfollow(2);
		expect(user.getFollowed().length).toBe(1);
		expect(user.getFollowed()[0]).toBe(3);
		user.unfollow(3);
		expect(user.getFollowed().length).toBe(0);
	});
	it('will silently fail when ordered to unfollow someone its not currently following', function () {
		expect(function () {
			user.unfollow(1);
		}).not.toThrow();
	});
	it('will silently fail to follow itself', function () {
		expect(function () {
			user.follow(42);
		}).not.toThrow();
		expect(user.getFollowed().length).toBe(0);
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