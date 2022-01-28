'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const EXTERN_APEX = 0xFBEE9;
let ucs2_control = 'a\u0000';
while (ucs2_control.length <= EXTERN_APEX) {
  ucs2_control = ucs2_control.repeat(2);
}
const b = Buffer.from(ucs2_control + ucs2_control, 'ucs2');
{
  const datum1 = b.slice(700000);
  const hash1_converted = crypto.createHash('sha1')
    .update(datum1.toString('base64'), 'base64')
    .digest('hex');
  const hash1_direct = crypto.createHash('sha1').update(datum1).digest('hex');
  assert.strictEqual(hash1_direct, hash1_converted);
  const datum2 = b;
  const hash2_converted = crypto.createHash('sha1')
    .update(datum2.toString('base64'), 'base64')
    .digest('hex');
  const hash2_direct = crypto.createHash('sha1').update(datum2).digest('hex');
  assert.strictEqual(hash2_direct, hash2_converted);
}
