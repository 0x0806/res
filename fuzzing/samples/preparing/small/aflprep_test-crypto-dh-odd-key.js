'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
function test() {
  const odd = Buffer.alloc(39, 'A');
  const c = crypto.createDiffieHellman(common.hasOpenSSL3 ? 1024 : 32);
  c.setPrivateKey(odd);
  c.generateKeys();
}
if (!common.hasFipsCrypto) {
  test();
} else {
}
