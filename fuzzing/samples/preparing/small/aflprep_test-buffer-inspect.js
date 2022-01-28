'use strict';
const assert = require('assert');
const util = require('util');
const buffer = require('buffer');
buffer.INSPECT_MAX_BYTES = 2;
let b = Buffer.allocUnsafe(4);
b.fill('1234');
let s = buffer.SlowBuffer(4);
s.fill('1234');
let expected = '<Buffer 31 32 ... 2 more bytes>';
assert.strictEqual(util.inspect(b), expected);
assert.strictEqual(util.inspect(s), expected);
b = Buffer.allocUnsafe(2);
b.fill('12');
s = buffer.SlowBuffer(2);
s.fill('12');
expected = '<Buffer 31 32>';
assert.strictEqual(util.inspect(b), expected);
assert.strictEqual(util.inspect(s), expected);
buffer.INSPECT_MAX_BYTES = Infinity;
assert.strictEqual(util.inspect(b), expected);
assert.strictEqual(util.inspect(s), expected);
b.inspect = undefined;
b.prop = new Uint8Array(0);
assert.strictEqual(
  util.inspect(b),
  '<Buffer 31 32, inspect: undefined, prop: Uint8Array(0) []>'
);
b = Buffer.alloc(0);
b.prop = 123;
assert.strictEqual(
  util.inspect(b),
  '<Buffer prop: 123>'
);
