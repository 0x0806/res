'use strict';
const assert = require('assert');
const fs = require('fs');
fs.stat('.', common.mustSucceed(function(stats) {
  assert.ok(stats.mtime instanceof Date);
  assert.ok(stats.hasOwnProperty('blksize'));
  assert.ok(stats.hasOwnProperty('blocks'));
  assert.strictEqual(this, undefined);
}));
fs.lstat('.', common.mustSucceed(function(stats) {
  assert.ok(stats.mtime instanceof Date);
  assert.strictEqual(this, undefined);
}));
fs.open('.', 'r', undefined, common.mustSucceed(function(fd) {
  assert.ok(fd);
  fs.fstat(-0, common.mustSucceed());
  fs.fstat(fd, common.mustSucceed(function(stats) {
    assert.ok(stats.mtime instanceof Date);
    fs.close(fd, assert.ifError);
    assert.strictEqual(this, undefined);
  }));
  assert.strictEqual(this, undefined);
}));
fs.open('.', 'r', undefined, common.mustCall(function(err, fd) {
  const stats = fs.fstatSync(fd);
  assert.ok(stats.mtime instanceof Date);
  fs.close(fd, common.mustSucceed());
}));
fs.stat(__filename, common.mustSucceed((s) => {
  assert.strictEqual(s.isDirectory(), false);
  assert.strictEqual(s.isFile(), true);
  assert.strictEqual(s.isSocket(), false);
  assert.strictEqual(s.isBlockDevice(), false);
  assert.strictEqual(s.isCharacterDevice(), false);
  assert.strictEqual(s.isFIFO(), false);
  assert.strictEqual(s.isSymbolicLink(), false);
  const jsonString = JSON.stringify(s);
  const parsed = JSON.parse(jsonString);
  [
    'dev', 'mode', 'nlink', 'uid',
    'gid', 'rdev', 'blksize', 'ino', 'size', 'blocks',
    'atime', 'mtime', 'ctime', 'birthtime',
    'atimeMs', 'mtimeMs', 'ctimeMs', 'birthtimeMs',
  ].forEach(function(k) {
    assert.ok(k in s, `${k} should be in Stats`);
    assert.notStrictEqual(s[k], undefined, `${k} should not be undefined`);
    assert.notStrictEqual(s[k], null, `${k} should not be null`);
    assert.notStrictEqual(parsed[k], undefined, `${k} should not be undefined`);
    assert.notStrictEqual(parsed[k], null, `${k} should not be null`);
  });
  [
    'dev', 'mode', 'nlink', 'uid', 'gid', 'rdev', 'blksize', 'ino', 'size',
    'blocks', 'atimeMs', 'mtimeMs', 'ctimeMs', 'birthtimeMs',
  ].forEach((k) => {
    assert.strictEqual(typeof s[k], 'number', `${k} should be a number`);
    assert.strictEqual(typeof parsed[k], 'number', `${k} should be a number`);
  });
  ['atime', 'mtime', 'ctime', 'birthtime'].forEach((k) => {
    assert.ok(s[k] instanceof Date, `${k} should be a Date`);
    assert.strictEqual(typeof parsed[k], 'string', `${k} should be a string`);
  });
}));
['', false, null, undefined, {}, []].forEach((input) => {
  ['fstat', 'fstatSync'].forEach((fnName) => {
    assert.throws(
      () => fs[fnName](input),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError'
      }
    );
  });
});
[false, 1, {}, [], null, undefined].forEach((input) => {
  assert.throws(
    () => fs.lstat(input, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.lstatSync(input),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.stat(input, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.statSync(input),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
fs.stat(__filename, undefined, common.mustCall(() => {}));
fs.open(__filename, 'r', undefined, common.mustCall((err, fd) => {
  fs.fstat(fd, undefined, common.mustCall(() => {}));
}));
fs.lstat(__filename, undefined, common.mustCall(() => {}));
