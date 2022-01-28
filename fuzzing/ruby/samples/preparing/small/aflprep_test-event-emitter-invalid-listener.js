'use strict';
const assert = require('assert');
const EventEmitter = require('events');
const eventsMethods = ['on', 'once', 'removeListener', 'prependOnceListener'];
for (const method of eventsMethods) {
  assert.throws(() => {
    const ee = new EventEmitter();
    ee[method]('foo', null);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "listener" argument must be of type function. ' +
             'Received null'
  }, `event.${method}('foo', null) should throw the proper error`);
}
