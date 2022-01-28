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
  buf.toString('latin1');
}, {
  message: `Cannot create a string longer than 0x${stringLengthHex} ` +
           'characters',
  code: 'ERR_STRING_TOO_LONG',
  name: 'Error'
});
global.gc();
let maxString = buf.toString('latin1', 1);
assert.strictEqual(maxString.length, kStringMaxLength);
maxString = undefined;
global.gc();
maxString = buf.toString('latin1', 0, kStringMaxLength);
assert.strictEqual(maxString.length, kStringMaxLength);
