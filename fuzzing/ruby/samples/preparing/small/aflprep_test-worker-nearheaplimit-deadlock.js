'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const opts = {
    resourceLimits: {
      maxYoungGenerationSizeMb: 0,
      maxOldGenerationSizeMb: 0
    }
  };
  const worker = new Worker(__filename, opts);
  worker.on('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'ERR_WORKER_OUT_OF_MEMORY');
  }));
} else {
  setInterval(() => {}, 1);
}
