'use strict';
const assert = require('assert');
const { createHook, AsyncResource } = require('async_hooks');
const resType = 'MyResource';
let activeId = -1;
createHook({
  init(id, type) {
    if (type === resType) {
      assert.strictEqual(activeId, -1);
      activeId = id;
    }
  },
  destroy(id) {
    if (activeId === id) {
      activeId = -1;
    }
  }
}).enable();
function testNextTick() {
  assert.strictEqual(activeId, -1);
  const res = new AsyncResource(resType);
  assert.strictEqual(activeId, res.asyncId());
  res.emitDestroy();
  process.nextTick(common.mustCall(() =>
    assert.strictEqual(activeId, res.asyncId()))
  );
}
function testQueueMicrotask() {
  assert.strictEqual(activeId, -1);
  const res = new AsyncResource(resType);
  assert.strictEqual(activeId, res.asyncId());
  res.emitDestroy();
  queueMicrotask(common.mustCall(() =>
    assert.strictEqual(activeId, res.asyncId()))
  );
}
function testImmediate() {
  assert.strictEqual(activeId, -1);
  const res = new AsyncResource(resType);
  assert.strictEqual(activeId, res.asyncId());
  res.emitDestroy();
  setImmediate(common.mustCall(() =>
    assert.strictEqual(activeId, -1))
  );
}
function testPromise() {
  assert.strictEqual(activeId, -1);
  const res = new AsyncResource(resType);
  assert.strictEqual(activeId, res.asyncId());
  res.emitDestroy();
  Promise.resolve().then(common.mustCall(() =>
    assert.strictEqual(activeId, res.asyncId()))
  );
}
async function testAwait() {
  assert.strictEqual(activeId, -1);
  const res = new AsyncResource(resType);
  assert.strictEqual(activeId, res.asyncId());
  res.emitDestroy();
  for (let i = 0; i < 5000; i++) {
    await Promise.resolve();
  }
  global.gc();
  await Promise.resolve();
  assert.strictEqual(activeId, res.asyncId());
  for (let i = 0; i < 5000; i++) {
    await Promise.resolve();
  }
  global.gc();
  await Promise.resolve();
  assert.strictEqual(activeId, -1);
}
testNextTick();
tick(2, testQueueMicrotask);
tick(4, testImmediate);
tick(6, testPromise);
tick(8, () => testAwait().then(common.mustCall()));
