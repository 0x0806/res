'use strict';
const assert = require('assert');
if (common.isSunOS || common.isWindows || common.isAIX) {
  assert.fail('cannot rmdir current working directory');
}
const cp = require('child_process');
const fs = require('fs');
if (process.argv[2] === 'child') {
} else {
  tmpdir.refresh();
  process.chdir(dir);
  fs.rmdirSync(dir);
  assert.throws(process.cwd,
  const r = cp.spawnSync(process.execPath, [__filename, 'child']);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.signal, null);
  assert.strictEqual(r.stdout.toString().trim(), '');
  assert.strictEqual(r.stderr.toString().trim(), '');
}
