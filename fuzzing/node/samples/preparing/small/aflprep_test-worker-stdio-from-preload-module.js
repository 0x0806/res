'use strict';
const { Worker } = require('worker_threads');
const assert = require('assert');
for (let i = 0; i < 10; i++) {
  const w = new Worker('console.log("B");', {
    execArgv: ['--require', fixtures.path('printA.js')],
    eval: true,
    stdout: true
  });
  w.on('exit', common.mustCall(() => {
    assert.strictEqual(w.stdout.read().toString(), 'A\nB\n');
  }));
}
