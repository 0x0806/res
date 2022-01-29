'use strict';
const EventEmitter = require('events');
class Foo extends EventEmitter {}
new Foo().emit('error', new Error());
