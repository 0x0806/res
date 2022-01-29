'use strict';
const skipMessage = 'intensive toString tests due to memory confinements';
if (!common.enoughTestMem)
  common.skip(skipMessage);
const assert = require('assert');
const kStringMaxLength = require('buffer').constants.MAX_STRING_LENGTH;
let buf;
try {
  buf = Buffer.allocUnsafe(kStringMaxLength);
} catch (e) {
  if (e.message !== 'Array buffer allocation failed') throw (e);
  common.skip(skipMessage);
}
if (!binding.ensureAllocation(2 * kStringMaxLength))
  common.skip(skipMessage);
const maxString = buf.toString('latin1');
assert.strictEqual(maxString.length, kStringMaxLength);
