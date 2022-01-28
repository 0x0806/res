'use strict';
const assert = require('assert');
const events = require('events');
const { inspect } = require('util');
const e = new events.EventEmitter();
e.on('maxListeners', common.mustCall());
e.setMaxListeners(42);
const throwsObjs = [NaN, -1, 'and even this'];
for (const obj of throwsObjs) {
  assert.throws(
    () => e.setMaxListeners(obj),
    {
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "n" is out of range. ' +
               `It must be a non-negative number. Received ${inspect(obj)}`
    }
  );
  assert.throws(
    () => events.defaultMaxListeners = obj,
    {
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "defaultMaxListeners" is out of range. ' +
               `It must be a non-negative number. Received ${inspect(obj)}`
    }
  );
}
e.emit('maxListeners');
{
  const { EventEmitter, defaultMaxListeners } = events;
  for (const obj of throwsObjs) {
    assert.throws(() => EventEmitter.setMaxListeners(obj), {
      code: 'ERR_OUT_OF_RANGE',
    });
  }
  assert.throws(
    () => EventEmitter.setMaxListeners(defaultMaxListeners, 'INVALID_EMITTER'),
    { code: 'ERR_INVALID_ARG_TYPE' }
  );
}
