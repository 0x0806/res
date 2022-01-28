'use strict';
if (!common.canCreateSymLink())
  common.skip('insufficient privileges');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
let linkTime;
let fileTime;
tmpdir.refresh();
const linkPath = path.join(tmpdir.path, 'symlink1.js');
fs.symlink(linkData, linkPath, common.mustSucceed(() => {
  fs.lstat(linkPath, common.mustSucceed((stats) => {
    linkTime = stats.mtime.getTime();
  }));
  fs.stat(linkPath, common.mustSucceed((stats) => {
    fileTime = stats.mtime.getTime();
  }));
  fs.readlink(linkPath, common.mustSucceed((destination) => {
    assert.strictEqual(destination, linkData);
  }));
}));
{
  const linkPath = path.join(tmpdir.path, 'symlink2.js');
  fs.symlink(linkData, linkPath, common.mustSucceed(() => {
    assert(!fs.existsSync(linkPath));
  }));
}
[false, 1, {}, [], null, undefined].forEach((input) => {
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  };
  assert.throws(() => fs.symlink(input, '', common.mustNotCall()), errObj);
  assert.throws(() => fs.symlinkSync(input, ''), errObj);
  assert.throws(() => fs.symlink('', input, common.mustNotCall()), errObj);
  assert.throws(() => fs.symlinkSync('', input), errObj);
});
const errObj = {
  code: 'ERR_FS_INVALID_SYMLINK_TYPE',
  name: 'Error',
  message:
    'Symlink type must be one of "dir", "file", or "junction". Received "🍏"'
};
assert.throws(() => fs.symlink('', '', '🍏', common.mustNotCall()), errObj);
assert.throws(() => fs.symlinkSync('', '', '🍏'), errObj);
process.on('exit', () => {
  assert.notStrictEqual(linkTime, fileTime);
});
