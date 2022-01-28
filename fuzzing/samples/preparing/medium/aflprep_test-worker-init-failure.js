'use strict';
const assert = require('assert');
const child_process = require('child_process');
if (common.isWindows) {
  common.skip('ulimit does not work on Windows.');
}
const OPENFILES = 128;
const WORKERCOUNT = 256;
if (process.argv[2] === 'child') {
  const { Worker } = require('worker_threads');
  for (let i = 0; i < WORKERCOUNT; ++i) {
    const worker = new Worker(
      'require(\'worker_threads\').parentPort.postMessage(2 + 2)',
      { eval: true });
    worker.on('message', (result) => {
      assert.strictEqual(result, 4);
    });
    const expected = ['ERR_WORKER_INIT_FAILED', 'EMFILE', 'ENFILE', 'ENOENT'];
    worker.on('error', (e) => {
      assert.ok(expected.includes(e.code), `${e.code} not expected`);
    });
  }
} else {
  let testCmd = `ulimit -n ${OPENFILES} && `;
  testCmd += `${process.execPath} ${__filename} child`;
  const cp = child_process.exec(testCmd);
  let stdout = '';
  cp.stdout.setEncoding('utf8');
  cp.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  let stderr = '';
  cp.stderr.setEncoding('utf8');
  cp.stderr.on('data', (chunk) => {
    stderr += chunk;
  });
  cp.on('exit', common.mustCall((code, signal) => {
    console.log(`child stdout: ${stdout}\n`);
    console.log(`child stderr: ${stderr}\n`);
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
  }));
}
