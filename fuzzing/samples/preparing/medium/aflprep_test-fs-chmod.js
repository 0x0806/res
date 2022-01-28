'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
let mode_async;
let mode_sync;
fs._open = fs.open;
fs._openSync = fs.openSync;
fs.open = open;
fs.openSync = openSync;
fs._close = fs.close;
fs._closeSync = fs.closeSync;
fs.close = close;
fs.closeSync = closeSync;
let openCount = 0;
function open() {
  openCount++;
  return fs._open.apply(fs, arguments);
}
function openSync() {
  openCount++;
  return fs._openSync.apply(fs, arguments);
}
function close() {
  openCount--;
  return fs._close.apply(fs, arguments);
}
function closeSync() {
  openCount--;
  return fs._closeSync.apply(fs, arguments);
}
if (common.isWindows) {
} else {
  mode_async = 0o777;
  mode_sync = 0o644;
}
tmpdir.refresh();
const file1 = path.join(tmpdir.path, 'a.js');
const file2 = path.join(tmpdir.path, 'a1.js');
fs.closeSync(fs.openSync(file1, 'w'));
fs.chmod(file1, mode_async.toString(8), common.mustSucceed(() => {
  if (common.isWindows) {
    assert.ok((fs.statSync(file1).mode & 0o777) & mode_async);
  } else {
    assert.strictEqual(fs.statSync(file1).mode & 0o777, mode_async);
  }
  fs.chmodSync(file1, mode_sync);
  if (common.isWindows) {
    assert.ok((fs.statSync(file1).mode & 0o777) & mode_sync);
  } else {
    assert.strictEqual(fs.statSync(file1).mode & 0o777, mode_sync);
  }
}));
fs.open(file2, 'w', common.mustSucceed((fd) => {
  fs.fchmod(fd, mode_async.toString(8), common.mustSucceed(() => {
    if (common.isWindows) {
      assert.ok((fs.fstatSync(fd).mode & 0o777) & mode_async);
    } else {
      assert.strictEqual(fs.fstatSync(fd).mode & 0o777, mode_async);
    }
    assert.throws(
      () => fs.fchmod(fd, {}),
      {
        code: 'ERR_INVALID_ARG_TYPE',
      }
    );
    fs.fchmodSync(fd, mode_sync);
    if (common.isWindows) {
      assert.ok((fs.fstatSync(fd).mode & 0o777) & mode_sync);
    } else {
      assert.strictEqual(fs.fstatSync(fd).mode & 0o777, mode_sync);
    }
    fs.close(fd, assert.ifError);
  }));
}));
if (fs.lchmod) {
  const link = path.join(tmpdir.path, 'symbolic-link');
  fs.symlinkSync(file2, link);
  fs.lchmod(link, mode_async, common.mustSucceed(() => {
    assert.strictEqual(fs.lstatSync(link).mode & 0o777, mode_async);
    fs.lchmodSync(link, mode_sync);
    assert.strictEqual(fs.lstatSync(link).mode & 0o777, mode_sync);
  }));
}
[false, 1, {}, [], null, undefined].forEach((input) => {
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "path" argument must be of type string or an instance ' +
             'of Buffer or URL.' +
             common.invalidArgTypeHelper(input)
  };
  assert.throws(() => fs.chmod(input, 1, common.mustNotCall()), errObj);
  assert.throws(() => fs.chmodSync(input, 1), errObj);
});
process.on('exit', function() {
  assert.strictEqual(openCount, 0);
});
