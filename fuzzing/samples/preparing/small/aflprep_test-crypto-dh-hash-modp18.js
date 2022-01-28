'use strict';
if (!common.hasCrypto) {
  common.skip('node compiled without OpenSSL.');
}
if (process.config.variables.arm_version === '7') {
  common.skip('Too slow for armv7 bots');
}
const assert = require('assert');
const crypto = require('crypto');
const hashes = {
  modp18: 'a870b491bbbec9b131ae9878d07449d32e54f160'
};
for (const name in hashes) {
  const group = crypto.getDiffieHellman(name);
  const private_key = group.getPrime('hex');
  const hash1 = hashes[name];
  const hash2 = crypto.createHash('sha1')
                    .update(private_key.toUpperCase()).digest('hex');
  assert.strictEqual(hash1, hash2);
  assert.strictEqual(group.getGenerator('hex'), '02');
}
