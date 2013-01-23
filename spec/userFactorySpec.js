var
	factory = require(__dirname + '/../lib/userFactory.js');


describe('userFactory', function () {

	beforeEach(function () {
		factory.reset();
	});

	it('creates and holds each user only once', function () {
		expect(factory.getUser(42)).toBe(factory.getUser(42));
		expect(factory.getUser(11)).toBe(factory.getUser(11));
		expect(factory.getUser(42)).not.toBe(factory.getUser(11));
	});
	it('can count known users', function () {
		expect(factory.getUserCount()).toBe(0);
		factory.getUser(42);
		expect(factory.getUserCount()).toBe(1);
		factory.getUser(1);
		factory.getUser(8);
		factory.getUser(8);
		expect(factory.getUserCount()).toBe(3);
	});
	it('violently rejects invalid userids', function () {
		var invalidIDs = [undefined, null, -1, 'mooo'];
		invalidIDs.forEach(function (id) {
			expect(function () {
				factory.getUser(id).toThrow();
			});
		});
	});
	it('can return all users', function () {
		var a;
		factory.getUser(1);
		factory.getUser(10);
		a = factory.getAllUsers();
		expect(a[1]).toBeTruthy();
		expect(a[10]).toBeTruthy();
	});

});