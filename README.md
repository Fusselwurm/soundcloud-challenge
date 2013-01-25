# soundcloud-challenge

Hi, I am Moritz.

This is my shot at the Soundcloud backend developer challenge.

## Dependencies

The implementation is done in JavaScript using [NodeJS](http://nodejs.org).
Works _at least_ on versions 0.6.0 to 0.8.18 .

Unit Test framework is [Jasmine](http://pivotal.github.com/jasmine/).


## File structure

As you will find it difficult to get lost in so small a project, I will keep this to a few remarks:

### bin/main.js

The executable, of course.

### resource/notes.md

I put some notes down while developing (progress, time tracking, thoughts about the structure etc).
I will leave them there for anybody interested in my thought process.
This is *not* in any way structured documentation, and contains some things that differ from what the program actually turned out to look like.

### lib/

Modules named new*.js contain a function acting as pseudo class (think "new" operator already attached to constructor function).

Those are the modules and their tasks:

* **clientServer**: opens socket to the user clients, emits connect/disconnect events
* **eventProcessor**: receives the events in correct order, and acts on them: forwards them to users, adds/deletes followers etc
* **eventQueue**: receives the events received by the sourceServer, and emits them again in correct order
* **followerGraph**: structure that connects followers/followed in both directions
* **newEvent**: constructor for the event models. May feel a bit over engineered because the event data structure is so dead simple, but there you go.
* **newUser**: constructor for the user models. users know their connected clients, and forward events to them
* **sourceServer**: opens socket for the source. parses incoming data, emits event models
* **userFactory**: stores the users

### spec/

Jasmine unit tests.

I did not write integration or networking tests. I felt that the connections between the objects are few enough so I could get away with it,
as long as I had the followermaze.jar as all-around-test.

## Things *not* implemented

If this code were ever to go into production somewhere,
there's some things that are definitely missing but that, I assume, are outside the scope of this exercise:

* There is no persistency. All connections between followers/following as well as the current sequence number and queued events are lost when you stop execution
* While all traffic that does not adhere to the protocol is discarded, there is no protection from for example
	* the source never sending a certain event number - forcing me to queue up all following events until I run out of memory.
	* Also, I do not forget users. Throw enough client IDs at me, and I will equally run out of memory
* I'd definitely need something more sinister than the ./FollowerMaze-assembly-1.0.jar to test my server.

## Confession: The last commit contains a bit of refactoring that was - partly - recommended to me by someone else

I felt the code finished yesterday evening with commit 210c35c0c322c035e6a777f4955041627746f656 .

Then I asked a fellow developer what he thought about it, and the first thing he did was point to the user model - which contained the follower graph. He said that should not be.

He was right - the follower graph feels better as separate structure. I felt lazy, but then I also couldnt leave it at that
(Also, the followers were stored in such a way within the user that you could get all users being followed by a certain user, but not the other way round).

So I just extracted the follower graph from the user model, and added it as a separate module.
With linking followers/followed back *and* forth.
