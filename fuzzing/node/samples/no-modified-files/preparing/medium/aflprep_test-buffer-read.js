'use strict';
const assert = require('assert');
const buf = Buffer.from([0xa4, 0xfd, 0x48, 0xea, 0xcf, 0xff, 0xd9, 0x01, 0xde]);
function read(buff, funx, args, expected) {
  assert.strictEqual(buff[funx](...args), expected);
  assert.throws(
    () => buff[funx](-1, args[1]),
    { code: 'ERR_OUT_OF_RANGE' }
  );
}
read(buf, 'readDoubleBE', [1], -3.1827727774563287e+295);
read(buf, 'readDoubleLE', [1], -6.966010051009108e+144);
read(buf, 'readFloatBE', [1], -1.6691549692541768e+37);
read(buf, 'readFloatLE', [1], -7861303808);
read(buf, 'readInt8', [1], -3);
read(buf, 'readInt16BE', [1], -696);
read(buf, 'readInt16LE', [1], 0x48fd);
read(buf, 'readInt32BE', [1], -45552945);
read(buf, 'readInt32LE', [1], -806729475);
read(buf, 'readIntBE', [1, 1], -3);
read(buf, 'readIntLE', [2, 1], 0x48);
read(buf, 'readUInt8', [1], 0xfd);
read(buf, 'readUInt16BE', [2], 0x48ea);
read(buf, 'readUInt16LE', [2], 0xea48);
read(buf, 'readUInt32BE', [1], 0xfd48eacf);
read(buf, 'readUInt32LE', [1], 0xcfea48fd);
read(buf, 'readUIntBE', [2, 2], 0x48ea);
read(buf, 'readUIntLE', [2, 2], 0xea48);
const OOR_ERROR =
{
  name: 'RangeError'
};
const OOB_ERROR =
{
  name: 'RangeError',
  message: 'Attempt to access memory outside buffer bounds'
};
assert.throws(
  () => Buffer.allocUnsafe(8).readFloatBE(0xffffffff), OOR_ERROR);
assert.throws(
  () => Buffer.allocUnsafe(8).readFloatLE(0xffffffff), OOR_ERROR);
assert.throws(
  () => Buffer.allocUnsafe(8).readFloatBE(-1), OOR_ERROR);
assert.throws(
  () => Buffer.allocUnsafe(8).readFloatLE(-1), OOR_ERROR);
{
  const buf = Buffer.allocUnsafe(0);
  assert.throws(
    () => buf.readUInt8(0), OOB_ERROR);
  assert.throws(
    () => buf.readInt8(0), OOB_ERROR);
}
[16, 32].forEach((bit) => {
  [`Int${bit}B`, `Int${bit}L`, `UInt${bit}B`, `UInt${bit}L`].forEach((fn) => {
    assert.throws(
      () => buf[`read${fn}E`](0), OOB_ERROR);
  });
});
[16, 32].forEach((bits) => {
  const buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]);
  ['LE', 'BE'].forEach((endian) => {
    assert.strictEqual(buf[`readUInt${bits}${endian}`](0),
                       (0xFFFFFFFF >>> (32 - bits)));
    assert.strictEqual(buf[`readInt${bits}${endian}`](0),
                       (0xFFFFFFFF >> (32 - bits)));
  });
});
