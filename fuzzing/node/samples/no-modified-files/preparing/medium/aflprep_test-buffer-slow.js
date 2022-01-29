'use strict';
const assert = require('assert');
const buffer = require('buffer');
const SlowBuffer = buffer.SlowBuffer;
const ones = [1, 1, 1, 1];
let sb = SlowBuffer(4);
assert(sb instanceof Buffer);
assert.strictEqual(sb.length, 4);
sb.fill(1);
for (const [key, value] of sb.entries()) {
  assert.deepStrictEqual(value, ones[key]);
}
assert.strictEqual(sb.buffer.byteLength, 4);
sb = SlowBuffer(4);
assert(sb instanceof Buffer);
assert.strictEqual(sb.length, 4);
sb.fill(1);
for (const [key, value] of sb.entries()) {
  assert.deepStrictEqual(value, ones[key]);
}
assert.strictEqual(SlowBuffer(0).length, 0);
try {
  assert.strictEqual(
    SlowBuffer(buffer.kMaxLength).length, buffer.kMaxLength);
} catch (e) {
  assert.strictEqual(e.name, 'RangeError');
}
const bufferInvalidTypeMsg = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
};
assert.throws(() => SlowBuffer(), bufferInvalidTypeMsg);
assert.throws(() => SlowBuffer({}), bufferInvalidTypeMsg);
assert.throws(() => SlowBuffer('6'), bufferInvalidTypeMsg);
assert.throws(() => SlowBuffer(true), bufferInvalidTypeMsg);
const bufferMaxSizeMsg = {
  code: 'ERR_INVALID_ARG_VALUE',
  name: 'RangeError',
};
assert.throws(() => SlowBuffer(NaN), bufferMaxSizeMsg);
assert.throws(() => SlowBuffer(Infinity), bufferMaxSizeMsg);
assert.throws(() => SlowBuffer(-1), bufferMaxSizeMsg);
assert.throws(() => SlowBuffer(buffer.kMaxLength + 1), bufferMaxSizeMsg);
