'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const ODD_LENGTH_PLAIN = 'Hello node world!';
const EVEN_LENGTH_PLAIN = 'Hello node world!AbC09876dDeFgHi';
const KEY_PLAIN = 'S3c.r.e.t.K.e.Y!';
const IV_PLAIN = 'blahFizz2011Buzz';
const CIPHER_NAME = 'aes-128-cbc';
const ODD_LENGTH_ENCRYPTED =
    '7f57859550d4d2fdb9806da2a750461a9fe77253cd1cbd4b07beee4e070d561f';
const EVEN_LENGTH_ENCRYPTED =
    '7f57859550d4d2fdb9806da2a750461ab46e71b3d78ebe2d9684dfc87f7575b988' +
    '6119866912cb8c7bcaf76c5ebc2378';
const EVEN_LENGTH_ENCRYPTED_NOPAD =
    '7f57859550d4d2fdb9806da2a750461ab46e71b3d78ebe2d9684dfc87f7575b9';
function enc(plain, pad) {
  const encrypt = crypto.createCipheriv(CIPHER_NAME, KEY_PLAIN, IV_PLAIN);
  encrypt.setAutoPadding(pad);
  let hex = encrypt.update(plain, 'ascii', 'hex');
  hex += encrypt.final('hex');
  return hex;
}
function dec(encd, pad) {
  const decrypt = crypto.createDecipheriv(CIPHER_NAME, KEY_PLAIN, IV_PLAIN);
  decrypt.setAutoPadding(pad);
  let plain = decrypt.update(encd, 'hex');
  plain += decrypt.final('latin1');
  return plain;
}
assert.strictEqual(enc(ODD_LENGTH_PLAIN, true), ODD_LENGTH_ENCRYPTED);
assert.strictEqual(enc(EVEN_LENGTH_PLAIN, true), EVEN_LENGTH_ENCRYPTED);
assert.throws(function() {
  enc(ODD_LENGTH_PLAIN, false);
}, common.hasOpenSSL3 ? {
  message: 'error:1C80006B:Provider routines::wrong final block length',
  code: 'ERR_OSSL_WRONG_FINAL_BLOCK_LENGTH',
  reason: 'wrong final block length',
} : {
  message: 'error:0607F08A:digital envelope routines:EVP_EncryptFinal_ex:' +
    'data not multiple of block length',
  code: 'ERR_OSSL_EVP_DATA_NOT_MULTIPLE_OF_BLOCK_LENGTH',
  reason: 'data not multiple of block length',
}
);
assert.strictEqual(
  enc(EVEN_LENGTH_PLAIN, false), EVEN_LENGTH_ENCRYPTED_NOPAD
);
assert.strictEqual(dec(ODD_LENGTH_ENCRYPTED, true), ODD_LENGTH_PLAIN);
assert.strictEqual(dec(EVEN_LENGTH_ENCRYPTED, true), EVEN_LENGTH_PLAIN);
assert.strictEqual(dec(ODD_LENGTH_ENCRYPTED, false).length, 32);
assert.strictEqual(dec(EVEN_LENGTH_ENCRYPTED, false).length, 48);
assert.throws(function() {
  assert.strictEqual(dec(EVEN_LENGTH_ENCRYPTED_NOPAD, true), EVEN_LENGTH_PLAIN);
}, common.hasOpenSSL3 ? {
  message: 'error:1C800064:Provider routines::bad decrypt',
  reason: 'bad decrypt',
  code: 'ERR_OSSL_BAD_DECRYPT',
} : {
  message: 'error:06065064:digital envelope routines:EVP_DecryptFinal_ex:' +
    'bad decrypt',
  reason: 'bad decrypt',
  code: 'ERR_OSSL_EVP_BAD_DECRYPT',
});
assert.strictEqual(
  dec(EVEN_LENGTH_ENCRYPTED_NOPAD, false), EVEN_LENGTH_PLAIN
);
