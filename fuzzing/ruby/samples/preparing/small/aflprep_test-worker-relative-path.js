'use strict';
const path = require('path');
const assert = require('assert');
const { Worker, isMainThread, parentPort } = require('worker_threads');
if (isMainThread) {
  w.on('message', common.mustCall((message) => {
    assert.strictEqual(message, 'Hello, world!');
  }));
} else {
  parentPort.postMessage('Hello, world!');
}
