'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const expected = Buffer.from('hello');
tmpdir.refresh();
{
  const filename = path.join(tmpdir.path, 'write1.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    const cb = common.mustSucceed((written) => {
      assert.strictEqual(written, expected.length);
      fs.closeSync(fd);
      const found = fs.readFileSync(filename, 'utf8');
      assert.strictEqual(found, expected.toString());
    });
    fs.write(fd, expected, 0, expected.length, null, cb);
  }));
}
{
  const filename = path.join(tmpdir.path, 'write2.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    const cb = common.mustSucceed((written) => {
      assert.strictEqual(written, 2);
      fs.closeSync(fd);
      const found = fs.readFileSync(filename, 'utf8');
      assert.strictEqual(found, 'lo');
    });
    fs.write(fd, Buffer.from('hello'), 3, cb);
  }));
}
{
  const filename = path.join(tmpdir.path, 'write3.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    const cb = common.mustSucceed((written) => {
      assert.strictEqual(written, expected.length);
      fs.closeSync(fd);
      const found = fs.readFileSync(filename, 'utf8');
      assert.deepStrictEqual(expected.toString(), found);
    });
    fs.write(fd, expected, cb);
  }));
}
{
  const filename = path.join(tmpdir.path, 'write4.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    const cb = common.mustSucceed((written) => {
      assert.strictEqual(written, expected.length);
      fs.closeSync(fd);
      const found = fs.readFileSync(filename, 'utf8');
      assert.deepStrictEqual(expected.toString(), found);
    });
    fs.write(fd, expected, undefined, cb);
  }));
}
{
  const filename = path.join(tmpdir.path, 'write5.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    const cb = common.mustSucceed((written) => {
      assert.strictEqual(written, expected.length);
      fs.closeSync(fd);
      const found = fs.readFileSync(filename, 'utf8');
      assert.strictEqual(found, expected.toString());
    });
    fs.write(fd, expected, undefined, undefined, cb);
  }));
}
{
  const filename = path.join(tmpdir.path, 'write6.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    const cb = common.mustSucceed((written) => {
      assert.strictEqual(written, expected.length);
      fs.closeSync(fd);
      const found = fs.readFileSync(filename, 'utf8');
      assert.strictEqual(found, expected.toString());
    });
    fs.write(fd, Uint8Array.from(expected), cb);
  }));
}
{
  const filename = path.join(tmpdir.path, 'write7.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    assert.throws(() => {
      fs.write(fd,
               Buffer.from('abcd'),
               NaN,
               expected.length,
               0,
               common.mustNotCall());
    }, {
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "offset" is out of range. ' +
               'It must be an integer. Received NaN'
    });
    fs.closeSync(fd);
  }));
}
{
  const filename = path.join(tmpdir.path, 'write8.txt');
  fs.open(filename, 'w', 0o644, common.mustSucceed((fd) => {
    const cb = common.mustSucceed((written) => {
      assert.strictEqual(written, expected.length);
      fs.closeSync(fd);
      const found = fs.readFileSync(filename, 'utf8');
      assert.strictEqual(found, expected.toString());
    });
    const uint8 = Uint8Array.from(expected);
    fs.write(fd, new DataView(uint8.buffer), cb);
  }));
}
