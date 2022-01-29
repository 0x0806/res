'use strict';
const assert = require('assert');
const {
  validateOffsetLengthRead,
  validateOffsetLengthWrite,
{
  const offset = -1;
  assert.throws(
    () => validateOffsetLengthRead(offset, 0, 0),
    common.expectsError({
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "offset" is out of range. ' +
                 `It must be >= 0. Received ${offset}`
    })
  );
}
{
  const length = -1;
  assert.throws(
    () => validateOffsetLengthRead(0, length, 0),
    common.expectsError({
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "length" is out of range. ' +
                 `It must be >= 0. Received ${length}`
    })
  );
}
{
  const offset = 1;
  const length = 1;
  const byteLength = offset + length - 1;
  assert.throws(
    () => validateOffsetLengthRead(offset, length, byteLength),
    common.expectsError({
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "length" is out of range. ' +
                 `It must be <= ${byteLength - offset}. Received ${length}`
    })
  );
}
const kIoMaxLength = 2 ** 31 - 1;
{
  const offset = 100;
  const length = 100;
  const byteLength = 50;
  assert.throws(
    () => validateOffsetLengthWrite(offset, length, byteLength),
    common.expectsError({
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "offset" is out of range. ' +
               `It must be <= ${byteLength}. Received ${offset}`
    })
  );
}
{
  const offset = kIoMaxLength - 150;
  const length = 200;
  const byteLength = kIoMaxLength - 100;
  assert.throws(
    () => validateOffsetLengthWrite(offset, length, byteLength),
    common.expectsError({
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "length" is out of range. ' +
               `It must be <= ${byteLength - offset}. Received ${length}`
    })
  );
}
