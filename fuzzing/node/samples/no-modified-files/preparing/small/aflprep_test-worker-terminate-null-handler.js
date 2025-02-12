'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
const worker = new Worker(`
const { parentPort } = require('worker_threads');
parentPort.postMessage({ hello: 'world' });
`, { eval: true });
process.once('beforeExit', common.mustCall(() => worker.ref()));
worker.on('exit', common.mustCall(() => {
  worker.terminate().then((res) => assert.strictEqual(res, undefined));
  worker.terminate(() => null).then(
    (res) => assert.strictEqual(res, undefined)
  );
}));
worker.unref();
