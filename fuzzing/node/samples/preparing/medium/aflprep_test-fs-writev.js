'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';
const getFileName = (i) => path.join(tmpdir.path, `writev_${i}.txt`);
 * Testing with a array of buffers input
{
  const filename = getFileName(1);
  const fd = fs.openSync(filename, 'w');
  const buffer = Buffer.from(expected);
  const bufferArr = [buffer, buffer];
  const done = common.mustSucceed((written, buffers) => {
    assert.deepStrictEqual(bufferArr, buffers);
    const expectedLength = bufferArr.length * buffer.byteLength;
    assert.deepStrictEqual(written, expectedLength);
    fs.closeSync(fd);
    assert(Buffer.concat(bufferArr).equals(fs.readFileSync(filename)));
  });
  fs.writev(fd, bufferArr, null, done);
}
{
  const filename = getFileName(2);
  const fd = fs.openSync(filename, 'w');
  const buffer = Buffer.from(expected);
  const bufferArr = [buffer, buffer];
  const done = common.mustSucceed((written, buffers) => {
    assert.deepStrictEqual(bufferArr, buffers);
    const expectedLength = bufferArr.length * buffer.byteLength;
    assert.deepStrictEqual(written, expectedLength);
    fs.closeSync(fd);
    assert(Buffer.concat(bufferArr).equals(fs.readFileSync(filename)));
  });
  fs.writev(fd, bufferArr, done);
}
 * Testing with wrong input types
{
  const filename = getFileName(3);
  const fd = fs.openSync(filename, 'w');
  [false, 'test', {}, [{}], ['sdf'], null, undefined].forEach((i) => {
    assert.throws(
      () => fs.writev(fd, i, null, common.mustNotCall()), {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError'
      }
    );
  });
  fs.closeSync(fd);
}
[false, 'test', {}, [{}], null, undefined].forEach((i) => {
  assert.throws(
    () => fs.writev(i, common.mustNotCall()),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    }
  );
});
