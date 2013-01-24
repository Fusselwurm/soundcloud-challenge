
* sh starts jar, which will pump requests to 9090 (for event source) and 9099 (the clients).
	* tcp
	* utf8
	* message separator: crlf

# todo
+ file structure
+ look for js test framework
* go :)
	+ create server, start followemaze, observe data
	++ did i understand the instructions concerning the data format?
	* models for
		* client
		* user
		* message queue
		* event
		* event parser
	* put it together
	* happyface


# times

## 2013-01-22 21:00 +0100
* 25': choosing test framework: jasmine, creating dir and dummy test to be sure
* 12': debugging... meh... jasmine calls "node", whereas debian installs it as "nodejs"
*  3': meh, also jasmine wants every file to be called *Spec.js . wtf?
* 25': set up socket server so client connect & disconnect are at least seen
* 15': listening in on the data received. yay :)
* 10': re-reading instructions. me thinks me now understand better. ^^ i had mentally skipped the follow/unfollow events. a-ha... ^^
* 20': thinking of structure. which entities do i have, what do they do...
(in between: müll rausbringen)
*22:30*

## 2013-01-23 21:00 +0100

* 15': linking jasmine-node src in intellij, try how mocking things works.
* 25': write down the execution path (with all the entities and connections and whatnot)
* 40': do user module, write user spec (except the clients part)
* 20': finish user module. meh.
* 22': userFactory module
* 30': eventQueue module. Somewhere in the spec there's a bug, im too stupid for jasmine, me thinks -.-
* 25': ok, got it. spies are neat, but be careful not to get lost in the maze of calls and arguments
*00:38*

## 2013-01-24 20:24 +0100

* 30': eventProcessor, event parser.
* 45': finish eventProcessor.
* break... 20'
* 20': clientServer. no TDD this time.
*  5': sourceServer
* 10': connecting the dots (main.js) . moments of breathtaking suspense...
*  2': eh. Connection resets? I'm a sad panda.
*  8': things are getting better. I'm receiving everything, but I dont seem to be sending...
* 25': change of tactics. parse events upfront, validate first what i get ^^. newEvent function as extra module. tests for validator.
* 18': switch to event objects all the way
* 10': correct for source using \n instead of \r\n
*00:04*


# structure

## modules

### userFactory

* factory for users
* holds existing users

### user

* one user
* knows his followers (methods to follow/unfollow others
* knows the currently connected clients (methods to add/remove a client)
* can receive messages (sends those to all his clients)

### eventQueue

* messages can pushed to it
* emits 'next' event, that gives the next message
* optionally - emits 'error' event
	* if next message takes too long (avoid getting locked!)
	* if too many messages are in there -> optional extension may be to start dropping msgs with lowest message ids


### sourceServer

* creates socket to listen to source
* emits 'event' event (mwahaha)

### clientServer

* creates server to listen to clients
* emits 'connect' event, passing userid & socket

### eventProcessor

* knows where a message should go

### eventParser

* parses events. surprise.

## execution path, entities involved


_note: I am all for short descriptions, so I'll write "onXXX" instead of "XXX event"_


* main creates sourceServer that:
	* listens on port 9090
	* emits onEvent
* main creates clientServer that:
	* listens on port 9099
	* for each client gets the userid and emits onConnect, passing the userid & the socket
* main creates eventQueue that:
	* emits 'next' event
* main creates the userFactory that:
	- knows the user module
	* can return users by their ID
	* can return all users in bulk
	* can return the total user count
* main creates eventProcessor that:
	- knows the userFactory
	* knows how to parse events (the events are so simple I wont write an extra parser module for that)
	* does what has to be done: gets the respective users and adds/removes followers, passes events...
* main attaches listener to clientServer.onConnect that:
	- knows the userFactory
	* will add clients/sockets to the respective users
* main attaches listener to sourceServer that:
	- knows the eventQueue
	* adds events to the eventQueue
* main attaches listener to eventQueue that:
	- knows eventProcessor
	* passes events to the eventProcessor