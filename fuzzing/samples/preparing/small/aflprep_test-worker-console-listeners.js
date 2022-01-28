'use strict';
const { Worker, isMainThread } = require('worker_threads');
const EventEmitter = require('events');
if (isMainThread) {
  process.on('warning', common.mustNotCall('unexpected warning'));
  for (let i = 0; i < EventEmitter.defaultMaxListeners; ++i) {
    const worker = new Worker(__filename);
    worker.on('exit', common.mustCall(() => {
    }));
  }
}
