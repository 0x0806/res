'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const iv = Buffer.from('00000000000000000000000000000000', 'hex');
const key = Buffer.from('0123456789abcdef0123456789abcdef' +
                        '0123456789abcdef0123456789abcdef', 'hex');
function encrypt(val, pad) {
  const c = crypto.createCipheriv('aes256', key, iv);
  c.setAutoPadding(pad);
  return c.update(val, 'utf8', 'latin1') + c.final('latin1');
}
function decrypt(val, pad) {
  const c = crypto.createDecipheriv('aes256', key, iv);
  c.setAutoPadding(pad);
  return c.update(val, 'latin1', 'utf8') + c.final('utf8');
}
let encrypted = encrypt(plaintext, false);
let decrypted = decrypt(encrypted, false);
assert.strictEqual(decrypted, plaintext);
encrypted = encrypt(plaintext, true);
decrypted = decrypt(encrypted, true);
assert.strictEqual(decrypted, plaintext);
