'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
const { Worker } = require('worker_threads');
if (process.argv[2] === 'child') {
  new Worker('throw new Error("foo");', { eval: true });
  return;
}
const child = spawn(process.execPath, [
  '--abort-on-uncaught-exception', __filename, 'child',
]);
child.on('exit', common.mustCall((code, sig) => {
  if (common.isWindows) {
    assert.strictEqual(code, 0x80000003);
  } else {
    assert(['SIGABRT', 'SIGTRAP', 'SIGILL'].includes(sig),
           `Unexpected signal ${sig}`);
  }
}));
