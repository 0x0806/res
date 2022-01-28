'use strict';
const { Worker, MessageChannel } = require('worker_threads');
for (let i = 0; i < 10; ++i) {
  const w = new Worker(
    "require('worker_threads').parentPort.on('message', () => {})",
    { eval: true });
  setImmediate(() => {
    const port = new MessageChannel().port1;
    w.postMessage({ port }, [ port ]);
    w.terminate();
  });
}
