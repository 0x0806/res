const assert = require('assert');
class Parent {}
class A extends Parent {}
module.exports = A;
process.nextTick(() => {
  assert.strictEqual(module.exports, A);
  assert.strictEqual(Object.getPrototypeOf(module.exports), Parent);
});
