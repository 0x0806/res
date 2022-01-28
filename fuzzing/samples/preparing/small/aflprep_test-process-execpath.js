'use strict';
if (common.isWindows)
  common.skip('symlinks are weird on windows');
const assert = require('assert');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
assert.strictEqual(process.execPath, fs.realpathSync(process.execPath));
if (process.argv[2] === 'child') {
  console.log(process.execPath);
} else {
  tmpdir.refresh();
  const symlinkedNode = path.join(tmpdir.path, 'symlinked-node');
  fs.symlinkSync(process.execPath, symlinkedNode);
  const proc = child_process.spawnSync(symlinkedNode, [__filename, 'child']);
  assert.strictEqual(proc.stderr.toString(), '');
  assert.strictEqual(proc.stdout.toString(), `${process.execPath}\n`);
  assert.strictEqual(proc.status, 0);
}
