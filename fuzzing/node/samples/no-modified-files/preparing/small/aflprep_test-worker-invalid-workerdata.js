'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
assert.throws(() => {
    workerData: { fn: () => {} }
  });
