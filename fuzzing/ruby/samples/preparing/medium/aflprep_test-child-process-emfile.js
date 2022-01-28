'use strict';
if (common.isWindows)
  common.skip('no RLIMIT_NOFILE on Windows');
const assert = require('assert');
const child_process = require('child_process');
const fs = require('fs');
const ulimit = Number(child_process.execSync('ulimit -Hn'));
if (ulimit > 64 || Number.isNaN(ulimit)) {
  const result = child_process.spawnSync(
    ['-c', `ulimit -n 64 && '${process.execPath}' '${__filename}'`]
  );
  assert.strictEqual(result.stdout.toString(), '');
  assert.strictEqual(result.stderr.toString(), '');
  assert.strictEqual(result.status, 0);
  assert.strictEqual(result.error, undefined);
  return;
}
const openFds = [];
for (;;) {
  try {
    openFds.push(fs.openSync(__filename, 'r'));
  } catch (err) {
    assert.strictEqual(err.code, 'EMFILE');
    break;
  }
}
const proc = child_process.spawn(process.execPath, ['-e', '0']);
assert.strictEqual(proc.stdin, undefined);
assert.strictEqual(proc.stdout, undefined);
assert.strictEqual(proc.stderr, undefined);
assert.strictEqual(proc.stdio, undefined);
proc.on('error', common.mustCall(function(err) {
  assert.strictEqual(err.code, 'EMFILE');
}));
proc.on('exit', common.mustNotCall('"exit" event should not be emitted'));
if (openFds.length >= 1) {
  fs.closeSync(openFds.pop());
}
