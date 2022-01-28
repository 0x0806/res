'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';
const exptectedBuff = Buffer.from(expected);
const expectedLength = exptectedBuff.length;
const filename = path.join(tmpdir.path, 'readv_sync.txt');
fs.writeFileSync(filename, exptectedBuff);
const allocateEmptyBuffers = (combinedLength) => {
  const bufferArr = [];
  bufferArr[1] = Buffer.alloc(combinedLength - bufferArr[0].length);
  return bufferArr;
};
{
  const fd = fs.openSync(filename, 'r');
  const bufferArr = allocateEmptyBuffers(exptectedBuff.length);
  let read = fs.readvSync(fd, [Buffer.from('')], 0);
  assert.deepStrictEqual(read, 0);
  read = fs.readvSync(fd, bufferArr, 0);
  assert.deepStrictEqual(read, expectedLength);
  fs.closeSync(fd);
  assert(Buffer.concat(bufferArr).equals(fs.readFileSync(filename)));
}
{
  const fd = fs.openSync(filename, 'r');
  const bufferArr = allocateEmptyBuffers(exptectedBuff.length);
  let read = fs.readvSync(fd, [Buffer.from('')]);
  assert.deepStrictEqual(read, 0);
  read = fs.readvSync(fd, bufferArr);
  assert.deepStrictEqual(read, expectedLength);
  fs.closeSync(fd);
  assert(Buffer.concat(bufferArr).equals(fs.readFileSync(filename)));
}
 * Testing with incorrect arguments
const wrongInputs = [false, 'test', {}, [{}], ['sdf'], null, undefined];
{
  const fd = fs.openSync(filename, 'r');
  wrongInputs.forEach((wrongInput) => {
    assert.throws(
      () => fs.readvSync(fd, wrongInput, null), {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError'
      }
    );
  });
  fs.closeSync(fd);
}
{
  wrongInputs.forEach((wrongInput) => {
    assert.throws(
      () => fs.readvSync(wrongInput),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError'
      }
    );
  });
}
