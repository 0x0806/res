'use strict';
const assert = require('assert');
const cp = require('child_process');
if (process.argv[2] === 'child') {
  console.log(process.ppid);
} else {
  const child = cp.spawnSync(process.execPath, [__filename, 'child']);
  assert.strictEqual(child.status, 0);
  assert.strictEqual(child.signal, null);
  assert.strictEqual(+child.stdout.toString().trim(), process.pid);
  assert.strictEqual(child.stderr.toString().trim(), '');
}
