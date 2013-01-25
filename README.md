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

I put some notes down while developing (progress, thoughts about the structure etc).
I will leave them there for anybody interested in my thought process.
This is *not* in any way structured documentation, and contains some things that differ from what the program actually turned out to look like.

### lib/

Modules named new*.js contain a function acting as pseudo class (think "new" operator already attached to constructor function)

### spec/

Jasmine unit tests.

## Things *not* implemented

If this code were ever to go into production somewhere,
there's some things that are definitely missing but that, I assume, are outside the scope of this exercise:

* There is no persistency. All connections between followers/following as well as the current sequence number and queued events are lost when you stop execution
* While all traffic that does not adhere to the protocol is discarded, there is no protection from for example
	* the source never sending a certain event number - forcing me to queue up all following events until I run out of memory.
	* Also, I do not forget users. Throw enough client IDs at me, and I will equally run out of memory
* So, I'd definitely need something more sinister than the ./FollowerMaze-assembly-1.0.jar to test my server.

I'd still like to look it over one more time, though: Order the notes and turn them into meaningful documentation, clarify some things in the unit tests (It looks a bit dirty, partly.)
