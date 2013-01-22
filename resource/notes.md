
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


# structure

## modules

### users

* factory for users
* holds existing users

### user

* one user
* knows his followers
* can follow/unfollow others

### message queue

* messages can pushed to it
* emits 'next' event, that gives the next message
* emits 'error' event
	* if next message takes too long (avoid getting locked!)
	* if too many messages are in there -> optional extension may be to start dropping msgs with lowest message ids


### source

* creates socket to listen to source
* emits 'event' event (mwahaha)

### clients

* creates socket to listen to clients
* emits 'connect' event
*

### controller

*interesting question*: who's the controller here? ive got two servers (for clients and source)... who is driving the whole thing? anothre
