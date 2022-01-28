'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const fn = path.join(tmpdir.path, 'write.txt');
const fn2 = path.join(tmpdir.path, 'write2.txt');
const fn3 = path.join(tmpdir.path, 'write3.txt');
const fn4 = path.join(tmpdir.path, 'write4.txt');
const fn5 = path.join(tmpdir.path, 'write5.txt');
const expected = 'ümlaut.';
const constants = fs.constants;
const { externalizeString, isOneByteString } = global;
common.allowGlobals(externalizeString, isOneByteString, global.x);
{
  externalizeString(expected);
  assert.strictEqual(isOneByteString(expected), true);
  const fd = fs.openSync(fn, 'w');
  fs.writeSync(fd, expected, 0, 'latin1');
  fs.closeSync(fd);
  assert.strictEqual(fs.readFileSync(fn, 'latin1'), expected);
}
{
  externalizeString(expected);
  assert.strictEqual(isOneByteString(expected), true);
  const fd = fs.openSync(fn, 'w');
  fs.writeSync(fd, expected, 0, 'utf8');
  fs.closeSync(fd);
  assert.strictEqual(fs.readFileSync(fn, 'utf8'), expected);
}
{
  externalizeString(expected);
  assert.strictEqual(isOneByteString(expected), false);
  const fd = fs.openSync(fn, 'w');
  fs.writeSync(fd, expected, 0, 'ucs2');
  fs.closeSync(fd);
  assert.strictEqual(fs.readFileSync(fn, 'ucs2'), expected);
}
{
  externalizeString(expected);
  assert.strictEqual(isOneByteString(expected), false);
  const fd = fs.openSync(fn, 'w');
  fs.writeSync(fd, expected, 0, 'utf8');
  fs.closeSync(fd);
  assert.strictEqual(fs.readFileSync(fn, 'utf8'), expected);
}
fs.open(fn, 'w', 0o644, common.mustSucceed((fd) => {
  const done = common.mustSucceed((written) => {
    assert.strictEqual(written, Buffer.byteLength(expected));
    fs.closeSync(fd);
    const found = fs.readFileSync(fn, 'utf8');
    fs.unlinkSync(fn);
    assert.strictEqual(found, expected);
  });
  const written = common.mustSucceed((written) => {
    assert.strictEqual(written, 0);
    fs.write(fd, expected, 0, 'utf8', done);
  });
  fs.write(fd, '', 0, 'utf8', written);
}));
const args = constants.O_CREAT | constants.O_WRONLY | constants.O_TRUNC;
fs.open(fn2, args, 0o644, common.mustSucceed((fd) => {
  const done = common.mustSucceed((written) => {
    assert.strictEqual(written, Buffer.byteLength(expected));
    fs.closeSync(fd);
    const found = fs.readFileSync(fn2, 'utf8');
    fs.unlinkSync(fn2);
    assert.strictEqual(found, expected);
  });
  const written = common.mustSucceed((written) => {
    assert.strictEqual(written, 0);
    fs.write(fd, expected, 0, 'utf8', done);
  });
  fs.write(fd, '', 0, 'utf8', written);
}));
fs.open(fn3, 'w', 0o644, common.mustSucceed((fd) => {
  const done = common.mustSucceed((written) => {
    assert.strictEqual(written, Buffer.byteLength(expected));
    fs.closeSync(fd);
  });
  fs.write(fd, expected, done);
}));
fs.open(fn4, 'w', 0o644, common.mustSucceed((fd) => {
  const done = common.mustSucceed((written) => {
    assert.strictEqual(written, Buffer.byteLength(expected));
    fs.closeSync(fd);
  });
  const data = {
    toString() { return expected; }
  };
  fs.write(fd, data, done);
}));
[false, 'test', {}, [], null, undefined].forEach((i) => {
  assert.throws(
    () => fs.write(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
  assert.throws(
    () => fs.writeSync(i),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
[false, 5, {}, [], null, undefined].forEach((data) => {
  assert.throws(
    () => fs.write(1, data, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  );
  assert.throws(
    () => fs.writeSync(1, data),
    {
      code: 'ERR_INVALID_ARG_TYPE',
    }
  );
});
{
  const fd = fs.openSync(fn5, 'w');
  assert.throws(
    () => fs.writeSync(fd, 'abc', 0, 'hex'),
    {
      code: 'ERR_INVALID_ARG_VALUE',
    }
  );
  assert.throws(
    () => fs.writeSync(fd, 'abc', 0, 'hex', common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_VALUE',
    }
  );
  assert.strictEqual(fs.writeSync(fd, 'abcd', 0, 'hex'), 2);
  fs.write(fd, 'abcd', 0, 'hex', common.mustSucceed((written) => {
    assert.strictEqual(written, 2);
    fs.closeSync(fd);
  }));
}
