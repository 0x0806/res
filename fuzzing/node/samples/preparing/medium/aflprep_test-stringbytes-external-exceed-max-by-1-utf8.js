'use strict';
const skipMessage = 'intensive toString tests due to memory confinements';
if (!common.enoughTestMem)
  common.skip(skipMessage);
const assert = require('assert');
const kStringMaxLength = require('buffer').constants.MAX_STRING_LENGTH;
let buf;
try {
  buf = Buffer.allocUnsafe(kStringMaxLength + 1);
} catch (e) {
  if (e.message !== 'Array buffer allocation failed') throw (e);
  common.skip(skipMessage);
}
if (!binding.ensureAllocation(2 * kStringMaxLength))
  common.skip(skipMessage);
const stringLengthHex = kStringMaxLength.toString(16);
assert.throws(() => {
  buf.toString();
}, (e) => {
  if (e.message !== 'Array buffer allocation failed') {
    common.expectsError({
      message: `Cannot create a string longer than 0x${stringLengthHex} ` +
               'characters',
      code: 'ERR_STRING_TOO_LONG',
      name: 'Error'
    })(e);
    return true;
  }
  return true;
});
assert.throws(() => {
  buf.toString('utf8');
}, {
  message: `Cannot create a string longer than 0x${stringLengthHex} ` +
           'characters',
  code: 'ERR_STRING_TOO_LONG',
  name: 'Error'
});
