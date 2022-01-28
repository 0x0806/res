'use strict';
const { Worker } = require('worker_threads');
const w = new Worker(`
require('worker_threads').parentPort.postMessage('0');
process.nextTick(() => {
  while(1);
});
`, { eval: true });
common.expectWarning(
  'DeprecationWarning',
  'Passing a callback to worker.terminate() is deprecated. ' +
  'It returns a Promise instead.', 'DEP0132');
w.on('message', common.mustCall(() => {
  setTimeout(() => {
    w.terminate(common.mustCall()).then(common.mustCall());
  }, 1);
}));
