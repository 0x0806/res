'use strict';
const assert = require('assert');
const SlowBuffer = require('buffer').SlowBuffer;
const len = 1422561062959;
const message = {
  code: 'ERR_INVALID_ARG_VALUE',
  name: 'RangeError',
};
assert.throws(() => Buffer(len).toString('utf8'), message);
assert.throws(() => SlowBuffer(len).toString('utf8'), message);
assert.throws(() => Buffer.alloc(len).toString('utf8'), message);
assert.throws(() => Buffer.allocUnsafe(len).toString('utf8'), message);
assert.throws(() => Buffer.allocUnsafeSlow(len).toString('utf8'), message);
