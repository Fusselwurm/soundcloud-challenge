#!/usr/bin/env node
var
	libDir = __dirname + '/../lib',
	sourceServer = require(libDir + '/sourceServer.js').start(),
	clientServer = require(libDir + '/clientServer.js'),
	eventQueue = require(libDir + '/eventQueue.js'),
	userFactory = require(libDir + '/userFactory.js'),
	eventProcessor = require(libDir + '/eventProcessor.js');


clientServer.on('connect', function (userid, socket) {
	userFactory.getUser(userid).addClient(socket);
});

clientServer.on('disconnect', function (userid, socket) {
	userFactory.getUser(userid).removeClient(socket);
});

sourceServer.on('event', function (sEvent) {
	eventQueue.add(sEvent);
});

eventQueue.on('next', function (sEvent) {
	eventProcessor.processEvent(sEvent);
});

// ... suspense ...

console.log('server running. me thinks.');