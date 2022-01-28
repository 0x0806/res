'use strict';
const assert = require('assert');
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = '1';
  if (!isMainThread) {
    common.skip('This test can only run as main thread');
  }
  process.chdir(__dirname);
  assert(!process.cwd.toString().includes('Atomics.load'));
  const w = new Worker(__filename);
  w.once('message', common.mustCall((message) => {
    assert.strictEqual(message, process.cwd());
    process.chdir('..');
    w.postMessage(process.cwd());
  }));
} else if (!process.env.SECOND_WORKER) {
  process.env.SECOND_WORKER = '1';
  const cwd = process.cwd();
  assert(process.cwd.toString().includes('Atomics.load'));
  const w = new Worker(__filename);
  w.once('message', common.mustCall((message) => {
    assert.strictEqual(process.cwd(), message);
    assert.strictEqual(message, cwd);
    parentPort.postMessage(cwd);
  }));
  parentPort.once('message', common.mustCall((message) => {
    assert.strictEqual(process.cwd(), message);
    assert.notStrictEqual(message, cwd);
    w.postMessage(message);
  }));
} else {
  const cwd = process.cwd();
  parentPort.postMessage(cwd);
  assert(process.cwd.toString().includes('Atomics.load'));
  parentPort.once('message', common.mustCall((message) => {
    assert.strictEqual(process.cwd(), message);
    assert.notStrictEqual(message, cwd);
  }));
}
