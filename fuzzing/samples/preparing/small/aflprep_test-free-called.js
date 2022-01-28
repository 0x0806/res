'use strict';
const path = require('path');
const assert = require('assert');
const { Worker } = require('worker_threads');
const { getFreeCallCount } = require(binding);
const w = new Worker(`require(${JSON.stringify(binding)})`, { eval: true });
assert.strictEqual(getFreeCallCount(), 0);
w.on('exit', common.mustCall(() => {
  assert.strictEqual(getFreeCallCount(), 1);
}));
