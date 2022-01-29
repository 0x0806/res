'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const tmpDir = tmpdir.path;
const longPath = path.join(...[tmpDir].concat(Array(30).fill('1234567890')));
fs.mkdirSync(longPath, { recursive: true });
const targetDirtectory = path.join(longPath, 'target-directory');
fs.mkdirSync(targetDirtectory);
const pathDirectory = path.join(tmpDir, 'new-directory');
fs.symlink(targetDirtectory, pathDirectory, 'dir', common.mustSucceed(() => {
  assert(fs.existsSync(pathDirectory));
}));
const targetFile = path.join(longPath, 'target-file');
fs.writeFileSync(targetFile, 'data');
const pathFile = path.join(tmpDir, 'new-file');
fs.symlink(targetFile, pathFile, common.mustSucceed(() => {
  assert(fs.existsSync(pathFile));
}));
