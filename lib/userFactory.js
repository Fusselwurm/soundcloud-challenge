/*

creates and holds users.

now that i see it, it looks quite empty.

*/


var
	newUser = require(__dirname + '/newUser.js'),
	users;

exports.getUser = function (userid) {
	if (!newUser.isValidUserid(userid)) {
		throw new Error('invalid userid: ' + userid);
	}
 	if (!users[userid]) {
		 users[userid] = newUser(userid);
	}
	return users[userid];
};
exports.getUserCount = function () {
	return Object.getOwnPropertyNames(users).length;
};

exports.getAllUsers = function () {
	return users;
};

exports.reset = function () {
	users = {};
};

exports.reset();