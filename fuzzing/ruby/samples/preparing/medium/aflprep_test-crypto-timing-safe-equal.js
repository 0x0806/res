'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
assert.strictEqual(
  crypto.timingSafeEqual(Buffer.from('foo'), Buffer.from('foo')),
  true
);
assert.strictEqual(
  crypto.timingSafeEqual(Buffer.from('foo'), Buffer.from('bar')),
  false
);
{
  const buf = crypto.randomBytes(16).buffer;
  const a1 = new Uint8Array(buf);
  const a2 = new Uint16Array(buf);
  const a3 = new Uint32Array(buf);
  for (const left of [a1, a2, a3]) {
    for (const right of [a1, a2, a3]) {
      assert.strictEqual(crypto.timingSafeEqual(left, right), true);
    }
  }
}
assert.throws(
  () => crypto.timingSafeEqual(Buffer.from([1, 2, 3]), Buffer.from([1, 2])),
  {
    code: 'ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH',
    name: 'RangeError',
    message: 'Input buffers must have the same byte length'
  }
);
assert.throws(
  () => crypto.timingSafeEqual('not a buffer', Buffer.from([1, 2])),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  }
);
assert.throws(
  () => crypto.timingSafeEqual(Buffer.from([1, 2]), 'not a buffer'),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  }
);
