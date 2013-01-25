// note concerning var names:
// I frequently mixed up follower/followed/following, so I took to naming the entities
// followObjects (passive, being followed) and
// followSubjects (active, following)
// that worked better for me ;)

var

	// structures that will connect the userids
	//
	// example:
	// * A follows B and C
	// * B follows C
	//
	// followObjects = {A : [B, C], B: [C]}
	// followSubjects = {B: [A], C: [A, B]}
	followObjects,
	followSubjects,

	// added as methods to the above arrays
	add = function (e) {
		if (this.indexOf(e) !== -1) {
			return;
		}
		this.push(e);
	},
	remove = function (e) {
		var idx = this.indexOf(e);
		if (idx === -1) {
			return;
		}
		this.splice(idx, 1);
	};

exports.reset = function () {
	followObjects = []; // all connections FROM the follower TO the followed
	followSubjects = []; // all connections FROM the followed TO the follower
};

exports.follow = function (subject, object) {
	followObjects[subject] = followObjects[subject] || [];
	add.call(followObjects[subject], object);

	followSubjects[object] = followSubjects[object] || [];
	add.call(followSubjects[object], subject);
};

exports.unfollow = function (subject, object) {
	var
		objects = followObjects[subject],
		subjects = followSubjects[object];

	if (objects) {
		remove.call(objects, object);
		if (!objects.length) {
			delete followObjects[subject];
		}
	}
	if (subjects) {
		remove.call(subjects, subject);
		if (!subjects.length) {
			delete followSubjects[object];
		}
	}
};

exports.getFollowers = function (object) {
	return (followSubjects[object] || []).sort();
};


exports.getFollowTargets = function (subject) {
	return (followObjects[subject] || []).sort();
};

exports.reset();