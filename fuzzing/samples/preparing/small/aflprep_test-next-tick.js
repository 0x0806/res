'use strict';
const assert = require('assert');
process.nextTick(common.mustCall(function() {
  process.nextTick(common.mustCall(function() {
    process.nextTick(common.mustCall());
  }));
}));
setTimeout(common.mustCall(function() {
  process.nextTick(common.mustCall());
}), 50);
process.nextTick(common.mustCall());
const obj = {};
process.nextTick(function(a, b) {
  assert.strictEqual(a, 42);
  assert.strictEqual(b, obj);
  assert.strictEqual(this, undefined);
}, 42, obj);
process.nextTick((a, b) => {
  assert.strictEqual(a, 42);
  assert.strictEqual(b, obj);
  assert.deepStrictEqual(this, {});
}, 42, obj);
process.nextTick(function() {
  assert.strictEqual(this, undefined);
}, 1, 2, 3, 4);
process.nextTick(() => {
  assert.deepStrictEqual(this, {});
}, 1, 2, 3, 4);
process.on('exit', function() {
  process.nextTick(common.mustNotCall());
});
