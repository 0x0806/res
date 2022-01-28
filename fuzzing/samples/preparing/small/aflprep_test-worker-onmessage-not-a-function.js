'use strict';
const { Worker, parentPort } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename);
  w.postMessage(2);
} else {
  parentPort.onmessage = common.mustNotCall();
  parentPort.onmessage = 'fhqwhgads';
}
