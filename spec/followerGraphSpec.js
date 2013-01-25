var followerGraph = require(__dirname + '/../lib/followerGraph.js');

//noinspection JSHint
describe('followerGraph', function () {

	it('has a reset method', function () {
		expect(followerGraph.reset).toBeDefined();
		expect(followerGraph.reset).not.toThrow();
	});

	it('has a follow method', function () {
		expect(followerGraph.follow).toBeDefined();
		expect(function () {
			followerGraph.follow(1, 2)
		}).not.toThrow();
	});

	it('has an unfollow method', function () {
		expect(followerGraph.unfollow).toBeDefined();
		expect(function () {
			followerGraph.unfollow(1, 2)
		}).not.toThrow();
	});

	it('has a getFollowers method', function () {
		expect(followerGraph.getFollowers).toBeDefined();
		expect(function () {
			followerGraph.getFollowers(1)
		}).not.toThrow();
	});

	it('has a getFollowTargets method', function () {
		expect(followerGraph.getFollowTargets).toBeDefined();
		expect(function () {
			followerGraph.getFollowTargets(1)
		}).not.toThrow();
	});

	describe('getting followers and followeds', function () {

		beforeEach(function () {
			followerGraph.reset();
			followerGraph.follow(1, 2);
			followerGraph.follow(1, 3);
			followerGraph.follow(1, 4);
			followerGraph.follow(1, 5);

			followerGraph.follow(2, 1);
			followerGraph.follow(2, 3);
			followerGraph.follow(2, 4);
			followerGraph.follow(2, 5);

			followerGraph.follow(3, 1);
			followerGraph.follow(3, 2);
			followerGraph.follow(3, 4);
			followerGraph.follow(3, 5);

			followerGraph.unfollow(3, 1);
			followerGraph.unfollow(3, 2);
		});

		it('correctly remembers a user\'s followers', function () {

			expect(JSON.stringify(followerGraph.getFollowers(4))).toBe("[1,2,3]");
			expect(JSON.stringify(followerGraph.getFollowers(6))).toBe("[]");

			expect(JSON.stringify(followerGraph.getFollowers(2))).toBe("[1]");
			expect(JSON.stringify(followerGraph.getFollowers(1))).toBe("[2]");
		});

		it('correctly remembers whom a user is following ', function () {

			expect(JSON.stringify(followerGraph.getFollowTargets(4))).toBe("[]");
			expect(JSON.stringify(followerGraph.getFollowTargets(6))).toBe("[]");

			expect(JSON.stringify(followerGraph.getFollowTargets(2))).toBe("[1,3,4,5]");
			expect(JSON.stringify(followerGraph.getFollowTargets(3))).toBe("[4,5]");
		});

		it('will not add followers twice', function () {
			followerGraph.follow(10, 11);
			followerGraph.follow(10, 11);
			followerGraph.follow(10, 11);
			expect(JSON.stringify(followerGraph.getFollowTargets(10))).toBe("[11]");
			expect(JSON.stringify(followerGraph.getFollowers(11))).toBe("[10]");
		});

	});

});