'use strict';
const EventEmitter = require('events');
new EventEmitter().emit('error', new Error());
