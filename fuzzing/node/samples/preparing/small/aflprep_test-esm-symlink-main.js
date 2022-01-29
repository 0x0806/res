'use strict';
const assert = require('assert');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
tmpdir.refresh();
const symlinkPath = path.resolve(tmpdir.path, 'symlink.mjs');
try {
  fs.symlinkSync(realPath, symlinkPath);
} catch (err) {
  if (err.code !== 'EPERM') throw err;
  common.skip('insufficient privileges for symlinks');
}
spawn(process.execPath,
      ['--preserve-symlinks', symlinkPath],
      { stdio: 'inherit' }).on('exit', (code) => {
  assert.strictEqual(code, 0);
});
