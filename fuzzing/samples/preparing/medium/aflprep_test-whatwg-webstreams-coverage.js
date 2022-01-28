'use strict';
const {
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
const {
  inspect,
} = require('util');
const {
  isPromisePending,
const assert = require('assert');
assert(!isPromisePending({}));
assert(!isPromisePending(Promise.resolve()));
assert(isPromisePending(new Promise(() => {})));
assert.throws(() => {
  Reflect.get(ByteLengthQueuingStrategy.prototype, 'highWaterMark', {});
}, {
  code: 'ERR_INVALID_THIS'
});
assert.throws(() => {
  Reflect.get(ByteLengthQueuingStrategy.prototype, 'size', {});
}, {
  code: 'ERR_INVALID_THIS'
});
assert.throws(() => {
  Reflect.get(CountQueuingStrategy.prototype, 'highWaterMark', {});
}, {
  code: 'ERR_INVALID_THIS'
});
assert.throws(() => {
  Reflect.get(CountQueuingStrategy.prototype, 'size', {});
}, {
  code: 'ERR_INVALID_THIS'
});
{
  const strategy = new CountQueuingStrategy({ highWaterMark: 1 });
  assert.strictEqual(
    inspect(strategy, { depth: null }),
    'CountQueuingStrategy { highWaterMark: 1 }');
  assert.strictEqual(
    inspect(strategy),
    'CountQueuingStrategy { highWaterMark: 1 }');
  assert.strictEqual(
    inspect(strategy, { depth: 0 }),
    'CountQueuingStrategy [Object]');
  assert.strictEqual(
    inspect(new ByteLengthQueuingStrategy({ highWaterMark: 1 })),
    'ByteLengthQueuingStrategy { highWaterMark: 1 }');
}
