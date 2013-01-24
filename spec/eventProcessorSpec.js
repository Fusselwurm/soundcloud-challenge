var
	eventProcessor = require(__dirname + '/../lib/eventProcessor.js'),
	newUser = require(__dirname + '/../lib/newUser.js');


describe('eventProcessor', function () {
	it('has a method to set the user factory', function () {
		expect(eventProcessor.setUserFactory).toBeDefined();
	});

	describe('processEvent', function () {
		it('exists as method', function () {
			expect(eventProcessor.processEvent).toBeDefined();
		});

		describe('processing private messages', function () {

			var userFactorySpy,
				userSpies;

			// rig all user behaviour.
			// I feel a bit bad about it. eventProcessor doesnt know whats coming for it.
			beforeEach(function () {
				userSpies = {};
				userFactorySpy = jasmine.createSpy('userFactory');
				userFactorySpy.getUser = function (userid) {
					var tmp;
					if (userSpies[userid]) {
						return userSpies[userid];
					}

					tmp = newUser(userid);
					spyOn(tmp, 'follow').andCallThrough();
					spyOn(tmp, 'unfollow').andCallThrough();
					spyOn(tmp, 'sendEvent');
					userSpies[userid] = tmp;
					return tmp;
				};
				userFactorySpy.getAllUsers = function () {
					return userSpies;
				};
				eventProcessor.setUserFactory(userFactorySpy);
			});



			it('passes a private message to the target user', function () {
				var event = {
					seq: 1,
					type: 'P',
					from: 3,
					to: 4,
					raw: '1|P|3|4'
				}; // message to user 4
				eventProcessor.processEvent(event);
				expect(userSpies[4]).toBeDefined();
				expect(userSpies[4].sendEvent).toHaveBeenCalledWith(event);
				expect(userSpies[3]).not.toBeDefined();
				expect(Object.getOwnPropertyNames(userSpies).length).toBe(1); // only one user needs to have been retrieved by the eventProcessor
			});

			it('adds a follower on follow event and notifies the victim', function () {
				var event = {
					seq: 1,
					type: 'F',
					from: 1,
					to: 2,
					raw: '1|F|1|2'
				};

				eventProcessor.processEvent(event);

				expect(userSpies[1]).toBeDefined();
				expect(userSpies[1].follow).toHaveBeenCalledWith(2);


				expect(userSpies[2]).toBeDefined();
				expect(userSpies[2].sendEvent).toHaveBeenCalledWith(event);

				expect(Object.getOwnPropertyNames(userSpies).length).toBe(2);
			});
			it('will unfollow', function () {
				var event = {
					seq: 1,
					type: 'U',
					from: 1,
					to: 2,
					raw: '1|U|1|2'
				};

				eventProcessor.processEvent(event);

				expect(userSpies[1]).toBeDefined();
				expect(userSpies[1].unfollow).toHaveBeenCalledWith(2);
				expect(userSpies[1].follow).not.toHaveBeenCalled(); // be sure thats the only thing that was called!
				expect(Object.getOwnPropertyNames(userSpies).length).toBe(1); // only one user needs to have been retrieved by the eventProcessor
			});
			it('can broadcast... to everybody', function () {

				var
					event = {
						seq: 1,
						type: 'B',
						from: 0,
						to: 0,
						raw: '1|B'
					},
					userids = [1, 2, 3, 4];

				userids.forEach(function (userid) {
					userFactorySpy.getUser(userid);
				});

				userFactorySpy.getUser(2);
				userFactorySpy.getUser(3);
				userFactorySpy.getUser(4);

				spyOn(userFactorySpy, 'getAllUsers').andReturn(userSpies);

				eventProcessor.processEvent(event);

				expect(userFactorySpy.getAllUsers).toHaveBeenCalled();
				userids.forEach(function (userid) {
					expect(userSpies[userid].sendEvent).toHaveBeenCalledWith(event);
				});

			});


			/*
			 * quoth the instructions:
			 * **Follow**: Only the `To User Id` should be notified
			 * **Unfollow**: No clients should be notified
			 * **Broadcast**: All connected *user clients* should be notified
			 * **Private Message**: Only the `To User Id` should be notified
			 * **Status Update**: All current followers of the `From User ID` should be notified
			 *
			 *
			 | Payload    | Sequence #| Type         | From User Id | To User Id |
			 |------------|-----------|--------------|--------------|------------|
			 |666|F|60|50 | 666       | Follow       | 60           | 50         |
			 |1|U|12|9    | 1         | Unfollow     | 12           | 9          |
			 |542532|B    | 542532    | Broadcast    | -            | -          |
			 |43|P|32|56  | 43        | Private Msg  | 2            | 56         |
			 |634|S|32    | 634       | Status Update| 32           | -          |
			 */

			it('sends status updates to all follower clients', function () {
				var
					followedUser = userFactorySpy.getUser(10),
					followingUsers = [11, 12, 13, 15].map(function (userid) {
						return userFactorySpy.getUser(userid);
					}),
					otherUser = userFactorySpy.getUser(14),
					event = {
						seq: 1,
						type: 'S',
						from: followedUser.getUserid(),
						to: 0,
						raw: '1|S|' + followedUser.getUserid()
					};

				followingUsers.forEach(function (user) {
					user.follow(followedUser.getUserid());
				});
				otherUser.follow(10);
				otherUser.unfollow(10);


				eventProcessor.processEvent(event);

				followingUsers.forEach(function (user) {
					expect(user.sendEvent).toHaveBeenCalledWith(event);
				});

				expect(followedUser.sendEvent).not.toHaveBeenCalled();
				expect(otherUser.sendEvent).not.toHaveBeenCalled();

			});
		});
	});
});