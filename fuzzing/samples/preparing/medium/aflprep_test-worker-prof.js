'use strict';
const fs = require('fs');
const assert = require('assert');
const util = require('util');
const { join } = require('path');
const { spawnSync } = require('child_process');
if (process.argv[2] === 'child') {
  const fs = require('fs');
  let files = fs.readdirSync(tmpdir.path);
  if (plog === undefined) {
    console.error('`--prof` did not produce a profile log for parent thread!');
    process.exit(1);
  }
  const pingpong = `
  let counter = 0;
  const fs = require('fs');
  const { Worker, parentPort  } = require('worker_threads');
  parentPort.on('message', (m) => {
    if (counter++ === 1024)
      process.exit(0);
    parentPort.postMessage(
      fs.readFileSync(m.toString()).slice(0, 1024 * 1024));
  });
  `;
  const { Worker } = require('worker_threads');
  const w = new Worker(pingpong, { eval: true });
  w.on('message', (m) => {
    w.postMessage(__filename);
  });
  w.on('exit', common.mustCall(() => {
    files = fs.readdirSync(tmpdir.path);
    if (wlog === undefined) {
      console.error('`--prof` did not produce a profile log' +
                    ' for worker thread!');
      process.exit(1);
    }
    process.exit(0);
  }));
  w.postMessage(__filename);
} else {
  tmpdir.refresh();
  const timeout = common.platformTimeout(30_000);
  const spawnResult = spawnSync(
    process.execPath, ['--prof', __filename, 'child'],
    { cwd: tmpdir.path, encoding: 'utf8', timeout });
  assert.strictEqual(spawnResult.stderr.toString(), '',
                     `child exited with an error: \
                     ${util.inspect(spawnResult)}`);
  assert.strictEqual(spawnResult.signal, null,
                     `child exited with signal: ${util.inspect(spawnResult)}`);
  assert.strictEqual(spawnResult.status, 0,
                     `child exited with non-zero status: \
                     ${util.inspect(spawnResult)}`);
  const files = fs.readdirSync(tmpdir.path);
  for (const logfile of logfiles) {
    const lines = fs.readFileSync(
      join(tmpdir.path, logfile), 'utf8').split('\n');
    assert(ticks >= 15, `${ticks} >= 15`);
  }
}
