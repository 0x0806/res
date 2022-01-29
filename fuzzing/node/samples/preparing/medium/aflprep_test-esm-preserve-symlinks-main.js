'use strict';
const { spawn } = require('child_process');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const tmpDir = tmpdir.path;
fs.mkdirSync(path.join(tmpDir, 'nested'));
fs.mkdirSync(path.join(tmpDir, 'nested2'));
const entry = path.join(tmpDir, 'nested', 'entry.js');
const entry_link_absolute_path = path.join(tmpDir, 'link.js');
const submodule = path.join(tmpDir, 'nested2', 'submodule.js');
const submodule_link_absolute_path = path.join(tmpDir, 'submodule_link.js');
fs.writeFileSync(entry, `
const assert = require('assert');
`);
fs.writeFileSync(submodule, '');
try {
  fs.symlinkSync(entry, entry_link_absolute_path);
  fs.symlinkSync(submodule, submodule_link_absolute_path);
} catch (err) {
  if (err.code !== 'EPERM') throw err;
  common.skip('insufficient privileges for symlinks');
}
function doTest(flags, done) {
  spawn(process.execPath,
        flags.concat([
          '--preserve-symlinks',
          '--preserve-symlinks-main', entry_link_absolute_path,
        ]),
        { stdio: 'inherit' }).on('exit', (code) => {
    assert.strictEqual(code, 0);
    done();
  });
}
doTest([], () => {
  doTest([], () => {});
});
