'use strict';
const assert = require('assert');
const worker = require('worker_threads');
const { Worker, parentPort } = worker;
const testCases = getTestCases(true);
if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  parent();
} else {
  if (!parentPort) {
    console.error('Parent port must not be null');
    process.exit(100);
    return;
  }
  parentPort.once('message', (msg) => testCases[msg].func());
}
function parent() {
  const test = (arg, name = 'worker', exit, error = null) => {
    const w = new Worker(__filename);
    w.on('exit', common.mustCall((code) => {
      assert.strictEqual(
        code, exit,
        `wrong exit for ${arg}-${name}\nexpected:${exit} but got:${code}`);
      console.log(`ok - ${arg} exited with ${exit}`);
    }));
    if (error) {
      w.on('error', common.mustCall((err) => {
        console.log(err);
        assert.match(String(err), error);
      }));
    }
    w.postMessage(arg);
  };
  testCases.forEach((tc, i) => test(i, tc.func.name, tc.result, tc.error));
}
