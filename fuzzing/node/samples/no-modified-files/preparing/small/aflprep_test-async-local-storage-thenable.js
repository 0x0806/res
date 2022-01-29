'use strict';
const assert = require('assert');
const { AsyncLocalStorage } = require('async_hooks');
const store = new AsyncLocalStorage();
const data = Symbol('verifier');
const then = common.mustCall((cb) => {
  assert.strictEqual(store.getStore(), data);
  setImmediate(cb);
}, 4);
function thenable() {
  return {
    then
  };
}
store.run(data, async () => {
  assert.strictEqual(store.getStore(), data);
  await thenable();
  assert.strictEqual(store.getStore(), data);
});
store.run(data, async () => {
  try {
    assert.strictEqual(store.getStore(), data);
    return thenable();
  } finally {
    assert.strictEqual(store.getStore(), data);
  }
});
store.run(data, () => {
  assert.strictEqual(store.getStore(), data);
  Promise.resolve(thenable());
  assert.strictEqual(store.getStore(), data);
});
store.run(data, () => {
  assert.strictEqual(store.getStore(), data);
  Promise.resolve().then(() => thenable());
  assert.strictEqual(store.getStore(), data);
});
