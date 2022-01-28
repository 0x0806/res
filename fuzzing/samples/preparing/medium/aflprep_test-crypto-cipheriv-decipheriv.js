'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
function testCipher1(key, iv) {
  const plaintext =
          '32|RmVZZkFUVmpRRkp0TmJaUm56ZU9qcnJkaXNNWVNpTTU*|iXmckfRWZBGWWELw' +
          'jAfaFg**';
  const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
  let ciph = cipher.update(plaintext, 'utf8', 'hex');
  ciph += cipher.final('hex');
  const decipher = crypto.createDecipheriv('des-ede3-cbc', key, iv);
  let txt = decipher.update(ciph, 'hex', 'utf8');
  txt += decipher.final('utf8');
  assert.strictEqual(txt, plaintext,
  const cStream = crypto.createCipheriv('des-ede3-cbc', key, iv);
  cStream.end(plaintext);
  ciph = cStream.read();
  const dStream = crypto.createDecipheriv('des-ede3-cbc', key, iv);
  dStream.end(ciph);
  txt = dStream.read().toString('utf8');
  assert.strictEqual(txt, plaintext,
                     `streaming cipher with key ${key} and iv ${iv}`);
}
function testCipher2(key, iv) {
  const plaintext =
          '32|RmVZZkFUVmpRRkp0TmJaUm56ZU9qcnJkaXNNWVNpTTU*|iXmckfRWZBGWWELw' +
          'jAfaFg**';
  const cipher = crypto.createCipheriv('des-ede3-cbc', key, iv);
  let ciph = cipher.update(plaintext, 'utf8', 'buffer');
  ciph = Buffer.concat([ciph, cipher.final('buffer')]);
  const decipher = crypto.createDecipheriv('des-ede3-cbc', key, iv);
  let txt = decipher.update(ciph, 'buffer', 'utf8');
  txt += decipher.final('utf8');
  assert.strictEqual(txt, plaintext,
}
function testCipher3(key, iv) {
  const plaintext = Buffer.from('00112233445566778899AABBCCDDEEFF', 'hex');
  const cipher = crypto.createCipheriv('id-aes128-wrap', key, iv);
  let ciph = cipher.update(plaintext, 'utf8', 'buffer');
  ciph = Buffer.concat([ciph, cipher.final('buffer')]);
  const ciph2 = Buffer.from('1FA68B0A8112B447AEF34BD8FB5A7B829D3E862371D2CFE5',
                            'hex');
  assert(ciph.equals(ciph2));
  const decipher = crypto.createDecipheriv('id-aes128-wrap', key, iv);
  let deciph = decipher.update(ciph, 'buffer');
  deciph = Buffer.concat([deciph, decipher.final()]);
  assert(deciph.equals(plaintext),
}
{
  const Cipheriv = crypto.Cipheriv;
  const key = '123456789012345678901234';
  const iv = '12345678';
  const instance = Cipheriv('des-ede3-cbc', key, iv);
  assert(instance instanceof Cipheriv, 'Cipheriv is expected to return a new ' +
                                       'instance when called without `new`');
  assert.throws(
    () => crypto.createCipheriv(null),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "cipher" argument must be of type string. ' +
               'Received null'
    });
  assert.throws(
    () => crypto.createCipheriv('des-ede3-cbc', null),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  assert.throws(
    () => crypto.createCipheriv('des-ede3-cbc', key, 10),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
}
{
  const Decipheriv = crypto.Decipheriv;
  const key = '123456789012345678901234';
  const iv = '12345678';
  const instance = Decipheriv('des-ede3-cbc', key, iv);
  assert(instance instanceof Decipheriv, 'Decipheriv expected to return a new' +
                                         ' instance when called without `new`');
  assert.throws(
    () => crypto.createDecipheriv(null),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "cipher" argument must be of type string. ' +
               'Received null'
    });
  assert.throws(
    () => crypto.createDecipheriv('des-ede3-cbc', null),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  assert.throws(
    () => crypto.createDecipheriv('des-ede3-cbc', key, 10),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
}
testCipher1('0123456789abcd0123456789', '12345678');
testCipher1('0123456789abcd0123456789', Buffer.from('12345678'));
testCipher1(Buffer.from('0123456789abcd0123456789'), '12345678');
testCipher1(Buffer.from('0123456789abcd0123456789'), Buffer.from('12345678'));
testCipher2(Buffer.from('0123456789abcd0123456789'), Buffer.from('12345678'));
if (!common.hasFipsCrypto) {
  testCipher3(Buffer.from('000102030405060708090A0B0C0D0E0F', 'hex'),
              Buffer.from('A6A6A6A6A6A6A6A6', 'hex'));
}
crypto.createCipheriv('aes-128-ecb', Buffer.alloc(16), Buffer.alloc(0));
crypto.createCipheriv('aes-128-ecb', Buffer.alloc(16), null);
for (let n = 1; n < 256; n += 1) {
  assert.throws(
    () => crypto.createCipheriv('aes-128-ecb', Buffer.alloc(16),
                                Buffer.alloc(n)),
    errMessage);
}
crypto.createCipheriv('aes-128-cbc', Buffer.alloc(16), Buffer.alloc(16));
for (let n = 0; n < 256; n += 1) {
  if (n === 16) continue;
  assert.throws(
    () => crypto.createCipheriv('aes-128-cbc', Buffer.alloc(16),
                                Buffer.alloc(n)),
    errMessage);
}
assert.throws(() => {
  crypto.createCipheriv('aes-128-cbc', Buffer.alloc(16), null);
assert.throws(
  () => crypto.createCipheriv('aes-128-gcm', Buffer.alloc(16),
                              Buffer.alloc(0)),
  errMessage);
const minIvLength = common.hasOpenSSL3 ? 8 : 1;
const maxIvLength = common.hasOpenSSL3 ? 64 : 256;
for (let n = minIvLength; n < maxIvLength; n += 1) {
  if (common.hasFipsCrypto && n < 12) continue;
  crypto.createCipheriv('aes-128-gcm', Buffer.alloc(16), Buffer.alloc(n));
}
{
  assert.throws(
    () => crypto.createCipheriv('aes-127', Buffer.alloc(16), null),
    {
      name: 'Error',
      code: 'ERR_CRYPTO_UNKNOWN_CIPHER',
      message: 'Unknown cipher'
    });
  assert.throws(
    () => crypto.createCipheriv('aes-128-ecb', Buffer.alloc(17), null),
}
