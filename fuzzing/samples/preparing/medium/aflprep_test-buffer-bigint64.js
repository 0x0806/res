'use strict';
const assert = require('assert');
const buf = Buffer.allocUnsafe(8);
['LE', 'BE'].forEach(function(endianness) {
  let val = 123456789n;
  buf[`writeBigInt64${endianness}`](val, 0);
  let rtn = buf[`readBigInt64${endianness}`](0);
  assert.strictEqual(val, rtn);
  val = 0x7fffffffffffffffn;
  buf[`writeBigInt64${endianness}`](val, 0);
  rtn = buf[`readBigInt64${endianness}`](0);
  assert.strictEqual(val, rtn);
  val = -123456789n;
  buf[`writeBigInt64${endianness}`](val, 0);
  assert.strictEqual(val, buf[`readBigInt64${endianness}`](0));
  val = 123456789n;
  buf[`writeBigUInt64${endianness}`](val, 0);
  assert.strictEqual(val, buf[`readBigUInt64${endianness}`](0));
  assert.throws(function() {
    const val = 0x8000000000000000n;
    buf[`writeBigInt64${endianness}`](val, 0);
  }, RangeError);
  assert.throws(function() {
    const val = 0x10000000000000000n;
    buf[`writeBigUInt64${endianness}`](val, 0);
  }, {
    code: 'ERR_OUT_OF_RANGE',
    message: 'The value of "value" is out of range. It must be ' +
      '>= 0n and < 2n ** 64n. Received 18_446_744_073_709_551_616n'
  });
  assert.throws(function() {
    buf[`writeBigInt64${endianness}`]('bad', 0);
  }, TypeError);
  assert.throws(function() {
    buf[`writeBigUInt64${endianness}`]('bad', 0);
  }, TypeError);
});
