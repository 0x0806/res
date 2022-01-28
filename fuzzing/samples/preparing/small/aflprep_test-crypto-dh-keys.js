'use strict';
if (!common.hasCrypto) {
  common.skip('node compiled without OpenSSL.');
}
if (process.config.variables.arm_version === '7') {
  common.skip('Too slow for armv7 bots');
}
const assert = require('assert');
const crypto = require('crypto');
[ 'modp1', 'modp2', 'modp5', 'modp14', 'modp15', 'modp16', 'modp17' ]
.forEach((name) => {
  if (name === 'modp1' && common.hasFipsCrypto)
    return;
  const group1 = crypto.getDiffieHellman(name);
  const group2 = crypto.getDiffieHellman(name);
  group1.generateKeys();
  group2.generateKeys();
  const key1 = group1.computeSecret(group2.getPublicKey());
  const key2 = group2.computeSecret(group1.getPublicKey());
  assert.deepStrictEqual(key1, key2);
});
