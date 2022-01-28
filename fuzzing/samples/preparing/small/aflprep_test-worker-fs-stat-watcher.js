'use strict';
const { Worker, parentPort } = require('worker_threads');
const fs = require('fs');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const worker = new Worker(__filename);
  worker.on('message', common.mustCall(() => worker.terminate()));
} else {
  fs.watchFile(__filename, () => {});
  parentPort.postMessage('running');
}
