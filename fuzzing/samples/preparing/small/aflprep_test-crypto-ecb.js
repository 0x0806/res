'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (common.hasFipsCrypto)
  common.skip('BF-ECB is not FIPS 140-2 compatible');
if (common.hasOpenSSL3)
  common.skip('Blowfish is only available with the legacy provider in ' +
    'OpenSSl 3.x');
const assert = require('assert');
const crypto = require('crypto');
{
  const encrypt =
    crypto.createCipheriv('BF-ECB', 'SomeRandomBlahz0c5GZVnR', '');
  let hex = encrypt.update('Hello World!', 'ascii', 'hex');
  hex += encrypt.final('hex');
  assert.strictEqual(hex.toUpperCase(), '6D385F424AAB0CFBF0BB86E07FFB7D71');
}
{
  const decrypt =
    crypto.createDecipheriv('BF-ECB', 'SomeRandomBlahz0c5GZVnR', '');
  let msg = decrypt.update('6D385F424AAB0CFBF0BB86E07FFB7D71', 'hex', 'ascii');
  msg += decrypt.final('ascii');
  assert.strictEqual(msg, 'Hello World!');
}
