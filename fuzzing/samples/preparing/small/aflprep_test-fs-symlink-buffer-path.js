'use strict';
if (!common.canCreateSymLink())
  common.skip('insufficient privileges');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const linkPath = path.join(tmpdir.path, 'symlink1.js');
let linkTime;
let fileTime;
fs.symlinkSync(Buffer.from(linkData), linkPath);
fs.lstat(linkPath, common.mustSucceed((stats) => {
  linkTime = stats.mtime.getTime();
}));
fs.stat(linkPath, common.mustSucceed((stats) => {
  fileTime = stats.mtime.getTime();
}));
fs.readlink(linkPath, common.mustSucceed((destination) => {
  assert.strictEqual(destination, linkData);
}));
process.on('exit', () => {
  assert.notStrictEqual(linkTime, fileTime);
});
