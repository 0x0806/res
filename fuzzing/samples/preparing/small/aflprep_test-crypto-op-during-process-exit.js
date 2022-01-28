'use strict';
if (!common.hasCrypto) { common.skip('missing crypto'); }
const assert = require('assert');
const { generateKeyPair } = require('crypto');
if (common.isWindows) {
}
generateKeyPair('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  }
  assert.ifError(err);
});
setTimeout(() => process.exit(), common.platformTimeout(10));
