'use strict';
const assert = require('assert');
const EventEmitter = require('events');
const EE = new EventEmitter();
{
  const ctx = Object.create(null);
  assert.throws(
    () => EE.emit.call(ctx, 'error', new Error('foo')),
    common.expectsError({ name: 'Error', message: 'foo' })
  );
}
assert.strictEqual(EE.emit.call({}, 'foo'), false);
