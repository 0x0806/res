'use strict';
const { parentPort, MessageChannel, Worker } = require('worker_threads');
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  const w = new Worker(__filename);
  w.once('message', common.mustCall(() => {
    w.once('message', common.mustNotCall());
    setTimeout(() => w.terminate(), 100);
  }));
} else {
  const { port1 } = new MessageChannel();
  parentPort.postMessage('ready');
  port1.postMessage({}, {
    transfer: (function*() { while (true); })()
  });
  parentPort.postMessage('UNREACHABLE');
  process.kill(process.pid, 'SIGINT');
}
