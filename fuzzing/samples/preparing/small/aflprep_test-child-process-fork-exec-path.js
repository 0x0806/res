'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const msg = { test: 'this' };
const nodePath = process.execPath;
const copyPath = path.join(tmpdir.path, 'node-copy.exe');
addLibraryPath(process.env);
if (process.env.FORK) {
  assert.strictEqual(process.execPath, copyPath);
  assert.ok(process.send);
  process.send(msg);
  return process.exit();
}
tmpdir.refresh();
assert.strictEqual(fs.existsSync(copyPath), false);
fs.copyFileSync(nodePath, copyPath, fs.constants.COPYFILE_FICLONE);
fs.chmodSync(copyPath, '0755');
const envCopy = { ...process.env, FORK: 'true' };
const child = fork(__filename, { execPath: copyPath, env: envCopy });
child.on('message', common.mustCall(function(recv) {
  assert.deepStrictEqual(recv, msg);
}));
child.on('exit', common.mustCall(function(code) {
  assert.strictEqual(code, 0);
}));
