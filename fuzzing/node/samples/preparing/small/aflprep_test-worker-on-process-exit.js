'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const { Worker } = require('worker_threads');
if (process.argv[2] !== 'child') {
  const {
    stdout, stderr, status
  } = spawnSync(process.execPath, [__filename, 'child'], { encoding: 'utf8' });
  assert.strictEqual(stderr, '');
  assert.strictEqual(stdout, '');
  assert.strictEqual(status, 0);
} else {
  const nestedWorker = new Worker('setInterval(() => {}, 100)', { eval: true });
  nestedWorker.on('exit', () => console.log('exit event received'));
  nestedWorker.on('online', () => process.exit());
}
