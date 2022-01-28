'use strict';
const assert = require('assert');
const fs = require('fs');
const filepath = fixtures.path('x.txt');
const fd = fs.openSync(filepath, 'r');
const expected = Buffer.from('xyz\n');
function test(bufferAsync, bufferSync, expected) {
  fs.read(fd,
          bufferAsync,
          0,
          expected.length,
          0,
          common.mustSucceed((bytesRead) => {
            assert.strictEqual(bytesRead, expected.length);
            assert.deepStrictEqual(bufferAsync, expected);
          }));
  const r = fs.readSync(fd, bufferSync, 0, expected.length, 0);
  assert.deepStrictEqual(bufferSync, expected);
  assert.strictEqual(r, expected.length);
}
test(Buffer.allocUnsafe(expected.length),
     Buffer.allocUnsafe(expected.length),
     expected);
test(new Uint8Array(expected.length),
     new Uint8Array(expected.length),
     Uint8Array.from(expected));
{
  const nRead = fs.readSync(fd, Buffer.alloc(1), 0, 1, pos);
  assert.strictEqual(nRead, 0);
  fs.read(fd, Buffer.alloc(1), 0, 1, pos, common.mustSucceed((nRead) => {
    assert.strictEqual(nRead, 0);
  }));
}
assert.throws(() => new fs.Dir(), {
  code: 'ERR_MISSING_ARGS',
});
assert.throws(
  () => fs.read(fd, Buffer.alloc(1), 0, 1, 0),
  {
    message: 'Callback must be a function. Received undefined',
    code: 'ERR_INVALID_CALLBACK',
  }
);
assert.throws(
  () => fs.read(fd, { buffer: null }, common.mustNotCall()),
  'throws when options.buffer is null'
);
assert.throws(
  () => fs.readSync(fd, { buffer: null }),
  {
    name: 'TypeError',
    message: 'The "buffer" argument must be an instance of Buffer, ' +
    'TypedArray, or DataView. Received an instance of Object',
  },
  'throws when options.buffer is null'
);
assert.throws(
  () => fs.read(null, Buffer.alloc(1), 0, 1, 0),
  {
    message: 'The "fd" argument must be of type number. Received null',
    code: 'ERR_INVALID_ARG_TYPE',
  }
);
