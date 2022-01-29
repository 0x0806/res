'use strict';
const assert = require('assert');
const symbol = Symbol('sym');
assert.strictEqual(process.env[symbol], undefined);
assert.throws(() => {
  process.env[symbol] = 42;
}, TypeError);
assert.throws(() => {
  process.env.foo = symbol;
}, TypeError);
assert.strictEqual(symbol in process.env, false);
assert.strictEqual(delete process.env[symbol], true);
Object.prototype.toString.call(process.env);
