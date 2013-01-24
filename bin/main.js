#!/usr/bin/env node
var x;

require(__dirname + '/../lib/sourceServer.js').start();
x = require(__dirname + '/../lib/clientServer.js');
x.start();
console.log('server running. me thinks.');