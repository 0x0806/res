'use strict';
if (!common.hasCrypto) {
  common.skip('missing crypto');
}
if (process.config.variables.arm_version === '7') {
  common.skip('Too slow for armv7 bots');
}
const assert = require('assert');
const crypto = require('crypto');
const length = (common.hasFipsCrypto || common.hasOpenSSL3) ? 1024 : 256;
const p = crypto.createDiffieHellman(length).getPrime();
for (let i = 0; i < 2000; i++) {
  const a = crypto.createDiffieHellman(p);
  const b = crypto.createDiffieHellman(p);
  a.generateKeys();
  b.generateKeys();
  const aSecret = a.computeSecret(b.getPublicKey());
  const bSecret = b.computeSecret(a.getPublicKey());
  assert.deepStrictEqual(
    aSecret,
    bSecret,
    'Secrets should be equal.\n' +
    `aSecret: ${aSecret.toString('base64')}\n` +
    `bSecret: ${bSecret.toString('base64')}`
  );
}
